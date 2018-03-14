//////////////////////////////////////////////////////////
//    temperature  A1      Don't forget pull pup data   //
//    rainsensor   A2                                   //
//    ultrasonic   A3                                   //]
//    PumpWaterPin 3                                    //
//    station id   100                                  //
//                                                      //
//////////////////////////////////////////////////////////

#include <Wire.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include <ArduinoJson.h>

#include <SPI.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

#define OLED_RESET 4
Adafruit_SSD1306 display(OLED_RESET);

#if (SSD1306_LCDHEIGHT != 64)
#error("Height incorrect, please fix Adafruit_SSD1306.h!");
#endif

#define NUMFLAKES 10
#define XPOS 0
#define YPOS 1
#define DELTAY 2

#include <RTClib.h>

RTC_DS3231 RTC;

#include "TEE_UC20.h"
#include "SoftwareSerial.h"
#include "call.h"
#include "sms.h"
#include "internet.h"
#include "File.h"
#include "http.h"

INTERNET net;
HTTP http; 
UC_FILE file;

//SIM TRUE  internet
#define APN "internet"
#define USER ""
#define PASS ""


char sensordata[30];                  // A 30 byte character array to hold incoming data from the sensors
byte sensor_bytes_received = 0;       // We need to know how many char   acters bytes have been received

byte code = 0;                        // used to hold the I2C response code.
byte in_char = 0;                     // used as a 1 byte buffer to store in bound bytes from the I2C Circuit.

#define TOTAL_CIRCUITS 3              // <-- CHANGE THIS | set how many I2C circuits are attached to the Tentacle shield(s): 1-8
#define Total_Data 150

int channel_ids[] = {97, 99, 100};    // <-- CHANGE THIS.
                                      // A list of I2C ids that you set your circuits to.
                                      // This array should have 1-8 elements (1-8 circuits connected)

char *channel_names[] = {"DO", "PH", "EC"}; // <-- CHANGE THIS.
// A list of channel names (must be the same order as in channel_ids[]) 
// it's used to give a name to each sensor ID. This array should have 1-8 elements (1-8 circuits connected).
// {"PH Tank 1", "PH Tank 2", "EC Tank 1", "EC Tank2"}, or {"PH"}

#define ONE_WIRE_BUS A1
OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature temp_sensor(&oneWire);

int ReinSensorPin = A2;
int analogPin_ultrasonic = A3;
int PumpWaterPin = 3;

String StationID = "213"; //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Station ID
int State = 0;
int ch = 0;

bool reset_manual = false;
bool Have_Reset = false;
bool Start_Flow = false;
bool Start_Read_Sensor = false;
bool Pump_isWork = false;
bool Pump_Overflow = false;
bool Finish_Read = false;
bool Start_Frist_Time = true;
bool saveMode = false;
bool testMode = true;
bool testMode_mode3 = true;


int mode;
int pinRoutine = 0;
int ultrasonic_routine;
int time_routine;
int round_H[2];
int round_M[2];
int delayBeforeReset;
int durationBeforePumpError;

int TimeResetHour;
int TimeResetMin;

int TimePumpErrorHour;
int TimePumpErrorMin;

int TimePumpStopHour;
int TimePumpStopMin;
int TimePumpStopSec;

int BreakReadData;
int CountRound = 0;
int CountError[3] = {0,0,0};


float temperate[6];
float sensorvalue[TOTAL_CIRCUITS][Total_Data];
float result[TOTAL_CIRCUITS];  

int RainSensor_Overflow;
int RainSensor_PumpWork;

int val_ultrasonic = 0;
int distance_cal = 50;
int distance_ewma[2] = {50, 50};
int distance = 0;

String message = "";
String finish_time = "";
DateTime now;

//////////////////////////////////////////////////
//                                              //
//        FUNCTION READ DATA FROM UC20          //
//                                              //
//////////////////////////////////////////////////

void debug(String data)
{
  Serial.println(data);
}

void data_out(char data)
{
  Serial.write(data);
}

void read_file(String pattern,String file_name)
{
  file.DataOutput =  data_out;
  file.ReadFile(pattern,file_name);
}

void set_message(char data)
{
  message = String(message + data);
  Serial.write(data);
}

void read_message(String pattern,String file_name)
{
  file.DataOutput =  set_message;
  file.ReadFile(pattern,file_name);
}

void digitalClockDisplay(void)
{
    // digital clock display of the time
    Serial.print(now.hour());
    printDigits(now.minute());
    printDigits(now.second());
    Serial.print(' ');
    Serial.print(now.day());
    Serial.print(' ');
    Serial.print(now.month());
    Serial.print(' ');
    Serial.print(now.year()); 
    Serial.println(); 
}

void printDigits(int digits)
{
    // utility function for digital clock display: 
    //prints preceding colon and leading 0
    Serial.print(':');
    if(digits < 10)
    {
      Serial.print('0');
    }
    Serial.print(digits);
}

//////////////////////////////////////////////////
//                                              //
//                  SET UP                      //
//                                              //
//////////////////////////////////////////////////

void setup() 
{
  Serial.begin(9600);
  Wire.begin();
  RTC.begin();
  now = RTC.now();
  RTC.setAlarm1Simple(0, 3);
  RTC.turnOnAlarm(1);

  temp_sensor.begin();
  pinMode(PumpWaterPin, OUTPUT);

  display.begin(SSD1306_SWITCHCAPVCC, 0x3C);
  display.display();
  delay(1000);
  display.clearDisplay();
  delay(100);

  startDisplay("Start GSM","");
  
  gsm.begin(&Serial1, 9600);
  gsm.Event_debug = debug;
  Serial.println(F("Start UC20"));
  gsm.PowerOn();
  while (gsm.WaitReady()) {}
//  Serial.print(F("GetOperator --> "));
//  Serial.println(gsm.GetOperator());

  delay(5000);

  startDisplay("Start GSM Success","SYNC DATA");

  if(!Sync_data())
  {
    Serial.println("-------------------------------SYNC FAIL SAVE MODE ON------------------------------------------");
    startDisplay("SYNC DATA Failed","Save Mode ON");
    delay(2000);
    saveMode = true;
  }
  else
  {
    Serial.println("-------------------------------SYNC Success ------------------------------------------");
    startDisplay("SYNC DATA Success","Start Flow");
    Sync_time();
    delay(1000);
  }
}

void loop() 
{
  if(reset_manual)
  {
    change_reset();
    Software_Reset();
  }
  now = RTC.now();
  if (RTC.checkIfAlarm(1)) {
    Sync_time();
  }          
  if(saveMode)
  {
    SaveModeDisplay();
    if (!Start_Flow && now.minute() % 5 == 0 && now.second() < 2)
    {
      getUltrasonic();
      if(distance_cal < 10)
      {
        SentError("ultrasonic",0);
      }
      else
      {
        SendData_ultra();
        Sent_Status("ultrasonic");
      }
    }
  }
  else
  {
    if(mode == 1)
    {
      Mode1Display();
      if (!Start_Flow && now.minute() % ultrasonic_routine == 0 && now.second() < 2 || testMode)
      {
        getUltrasonic();
        if(distance_cal < 10)
        {
          SentError("ultrasonic",0);
        }
        else
        {
          SendData_ultra();
          Sent_Status("ultrasonic");
        }
      }
    }
    else if(mode == 2)
    {
      runTime();
      if(!Start_Read_Sensor && Start_Frist_Time)
      {
        Mode2StratDisplay();
      }
      if(!Start_Frist_Time && Finish_Read)
      {
        Mode2EndDisplay();
      }
      if(Start_Flow)
      {
        Check_Pump();
      }
      if(CountRound == BreakReadData)
      {
        StopPumpWasteWaterIn();
        Start_Frist_Time = false;
        CountRound = 0;
        Start_Flow = false;
        Start_Read_Sensor = false;
        Finish_Read = true;
        timeFinish();
        digitalClockDisplay();
        Average_Data();
        temperature();
        Sent_Status("pump");
        if(temperate[5] <= -123)
        {
          SentError("watertemp",0);
        }
        else
        {
          Sent_Status("watertemp");
        }

        if(CountError[0] > BreakReadData/2)
        {
          SentError("doxigen",0);
        }
        else
        {
          Sent_Status("doxigen");
        }

        if(CountError[1] > BreakReadData/2)
        {
          SentError("ph",0);
        }
        else
        {
          Sent_Status("ph");
        }

        if(CountError[2] > BreakReadData/2)
        {
          SentError("conductivity",0);
        }
        else
        {
          Sent_Status("conductivity");
        }
        
        SendData_Quality();
      }

      if(Start_Read_Sensor)
      {
        Read_Sensor_QQ();
      }
      
      if(ch == TOTAL_CIRCUITS)
      {
        ch = 0;
        CountRound++;
      }

      if (!Start_Flow && now.minute() % 5 == 0 && now.second() < 5)
      {
        Sync_data();
      }

    }
    else if (mode == 3)
    {
      runTime();
      if(!Start_Read_Sensor && Start_Frist_Time)
      {
        Mode3StratDisplay();
      }
      if(!Start_Frist_Time && Finish_Read)
      {
        Mode3EndDisplay();
      }
      if(Start_Flow)
      {
        Check_Pump();
      }
      if(CountRound == BreakReadData)
      {
        StopPumpWasteWaterIn();
        Start_Frist_Time = false;
        CountRound = 0;
        Start_Flow = false;
        Start_Read_Sensor = false;
        Finish_Read = true;
        timeFinish();
        digitalClockDisplay();
        Average_Data();
        temperature();
        Sent_Status("pump");
        if(temperate[5] <= -123)
        {
          SentError("watertemp",0);
        }
        else
        {
          Sent_Status("watertemp");
        }

        if(CountError[0] > BreakReadData/2)
        {
          SentError("doxigen",0);
        }
        else
        {
          Sent_Status("doxigen");
        }

        if(CountError[1] > BreakReadData/2)
        {
          SentError("ph",0);
        }
        else
        {
          Sent_Status("ph");
        }

        if(CountError[2] > BreakReadData/2)
        {
          SentError("conductivity",0);
        }
        else
        {
          Sent_Status("conductivity");
        }

        SendData_Quality();
      }

      if(Start_Read_Sensor)
      {
        Read_Sensor_QQ();
      }
      
      if(ch == TOTAL_CIRCUITS)
      {
        ch = 0;
        CountRound++;
      }

      if ((!Start_Flow && now.minute() % ultrasonic_routine == 0 && now.second() < 2 )|| (testMode_mode3 && Finish_Read))
      {
        getUltrasonic();
        if(distance_cal < 10)
        {
          SentError("ultrasonic",0);
        }
        else
        {
          SendData_ultra();
          Sent_Status("ultrasonic");
        }
      }

    }
    else if (mode == 4)
    {
      PumpWasteWaterIn();
      Mode4Display();
    }
  }
  
}

void NextPinRoutine()
{
  if(round_H[pinRoutine+1] == 99)
  {
    pinRoutine = 0;
  }
  else
  {
    pinRoutine++;
  }
}

void TimeOnTop()
{
  String tmptime;
  tmptime = "";
  tmptime += now.day();
  tmptime += "/";
  tmptime += now.month();
  tmptime += "/";
  tmptime += now.year();
  tmptime += " ";
  tmptime += now.hour();
  tmptime += ":";
  if ( now.minute() < 10 )
  {
    tmptime += "0";
  }
  tmptime += now.minute();
  tmptime += ":";
  if (now.second() < 10)
  {
    tmptime += "0";
  }
  tmptime += now.second();

  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(WHITE);
  display.setCursor(0, 0);
  display.println(tmptime);
  display.println();
}

void SaveModeDisplay() 
{
  showUltrasonic();
  TimeOnTop();
  display.setTextSize(2);
  display.setTextColor(WHITE);
  display.println("SAVE MODE");
  display.setTextSize(1);
  display.println();
  display.print("DISTANCE ");
  display.println(distance);
  display.display();
}

void Mode1Display() 
{
  showUltrasonic();
  TimeOnTop();
  display.setTextSize(2);
  display.setTextColor(WHITE);
  display.println("MODE 1");
  display.setTextSize(1);
  display.println();
  display.print("DISTANCE ");
  display.println(distance);
  display.display();
}

void Mode2StratDisplay() 
{
  showUltrasonic();
  TimeOnTop();
  display.setTextSize(2);
  display.setTextColor(WHITE);
  display.println("MODE 2 PUMP ONLY");
  display.setTextSize(1);
  display.println();
  display.display();
}

void Mode2EndDisplay() 
{
  TimeOnTop();
  display.setTextColor(WHITE);
  display.println(finish_time);
  display.print("DO = ");
  display.println(result[0]);
  display.print("pH = ");
  display.println(result[1]);
  display.print("Conductor = ");
  display.println(result[2]);
  display.println();
  // display.flip();
  display.display();
}

void Mode3StratDisplay() 
{
  showUltrasonic();
  TimeOnTop();
  display.setTextSize(2);
  display.setTextColor(WHITE);
  display.println("MODE 3 Both");
  display.setTextSize(1);
  display.println();
  display.print("DISTANCE ");
  display.println(distance);
  display.display();
}

void Mode3EndDisplay() 
{
  showUltrasonic();
  TimeOnTop();
  display.setTextColor(WHITE);
  display.println(finish_time);
  display.print("DO = ");
  display.println(result[0]);
  display.print("pH = ");
  display.println(result[1]);
  display.print("Conductor = ");
  display.println(result[2]);
  display.println();
  display.print("Distance = ");
  display.println(distance);
  // display.flip();
  display.display();
}


void Mode4Display() 
{
  TimeOnTop();
  display.setTextSize(2);
  display.setTextColor(WHITE);
  display.println("MODE 4 Rain");
  display.setTextSize(1);
  display.println();
  display.print("Rain ");
  display.println(analogRead(ReinSensorPin));
  display.display();
}

void startDisplay(String status,String process) 
{
  TimeOnTop();
  display.setTextSize(2);
  display.setTextColor(WHITE);
  display.println("   OASYS");
  display.setTextSize(1);
  display.println();
  display.print("  ");
  display.println(status); 
  display.print("     ");
  display.println(process);   
  display.display();
}

void timeFinish() 
{
  finish_time = "";
  finish_time += now.hour();
  finish_time += ":";
  if ( now.minute() < 10 )
  {
    finish_time += "0";
  }
  finish_time += now.minute();
  finish_time += ":";
  if (now.second() < 10)
  {
    finish_time += "0";
  }
  finish_time += now.second();
  finish_time += " ";
  finish_time += now.day();
  finish_time += "/";
  finish_time += now.month();
  finish_time += "/";
  finish_time += now.year();
}

void runTime() 
{
  if (( now.hour() == round_H[pinRoutine] && now.minute() == round_M[pinRoutine] ) || testMode)
  {
    if(!Start_Flow)
    {
      Serial.println("THIS TIME TO START");
      Start_Flow = true;
      Pump_isWork = false;
      Finish_Read = false;
      PumpWasteWaterIn();
    }
  }

  if(!Pump_isWork)
  {
    if((now.hour() == TimePumpErrorHour && now.minute() == TimePumpErrorMin && !Have_Reset))
    {
      State = 1;
      if(mode == 2)
      {
        Reset_Board();
      }
      else if(mode == 3)
      {
        change_mode();
      }
    }
  }

  if(Have_Reset)
  {
    if((now.hour() == TimeResetHour && now.minute() == TimeResetMin))
    {
      Software_Reset();
    }
  }
}

void Check_Pump()
{
  int val = analogRead(ReinSensorPin);
  Serial.print("Rain : ");
  Serial.println(val);
  if(Pump_Overflow)
  {
    if(now.hour() == TimePumpStopHour && now.minute() >= TimePumpStopMin && now.second() >= TimePumpStopSec)
    {      
      Pump_Overflow = false;
      PumpWasteWaterIn();
    }
  }
  // Stop pump 30 S
  if (val < RainSensor_Overflow && !Pump_Overflow)
  {
    Serial.println("TRICK WATER IN AND OUT OVERFLOW");
    Pump_Overflow = true;
    StopPumpWasteWaterIn();
    SetTimePumpStop_S(30);
  }

  if (val < RainSensor_PumpWork)
  {
    Serial.println("TRICK PUMP WATER IS WORK");
    Pump_isWork = true;
    Start_Read_Sensor = true;
  }
}

void PumpWasteWaterIn() 
{
  Serial.println("Start Pump IN");
  digitalWrite(PumpWaterPin, HIGH);

  SetPumpErrorTime_Start();
}

void StopPumpWasteWaterIn() 
{
  digitalWrite(PumpWaterPin, LOW);
  Serial.println("Stop Pump IN");
}

void SetPumpErrorTime_Start()
{
  if (now.minute() + durationBeforePumpError >= 60)
  {
    if (now.hour() == 23)
    {
      TimePumpErrorHour = 0;
    }
    else
    {
      TimePumpErrorHour = now.hour() + 1;
    }
    TimePumpErrorMin = now.minute() + durationBeforePumpError - 60;
  }
  else
  {
    TimePumpErrorHour = now.hour();
    TimePumpErrorMin = now.minute() + durationBeforePumpError;
  }
  Serial.print("Time Error Pump ");
  Serial.print(TimePumpErrorHour);
  Serial.print(":");
  Serial.println(TimePumpErrorMin);
}

void SetTimePumpStop_S(int time_pump_stop)
{
  if(now.second() + time_pump_stop >= 60)
  {
    if(now.minute() + 1 >= 60)
    {
      if(now.hour() == 23)
      {
        TimePumpStopHour = 0;
      }
      else
      {
        TimePumpStopHour = now.hour() + 1 ;
      }
      TimePumpStopMin = now.minute() + 1 - 60;
      TimePumpStopSec = now.second() + time_pump_stop - 60;
    }
    else
    {
      TimePumpStopHour = now.hour();
      TimePumpStopMin = now.minute() + 1;
      TimePumpStopSec = now.second() + time_pump_stop - 60;
    }
  }
  else
  {
    TimePumpStopHour = now.hour();
    TimePumpStopMin = now.minute();
    TimePumpStopSec = now.second() + time_pump_stop;
  }
}

void temperature()
{
  int l = 0;
  float tmpsum = 0;
  while (l < 5)
  {
    Serial.print(" Requesting temperatures...");
    temp_sensor.requestTemperatures(); // Send the command to get temperatures
    Serial.println("DONE");
    Serial.print("Temperature for Device 1 is: ");
    temperate[l] = temp_sensor.getTempCByIndex(0);
    Serial.print(temperate[l]);
    tmpsum += temperate[l];
    l++;
  }
  temperate[5] = tmpsum / 5;
}

void showUltrasonic()
{
  distance = analogRead(analogPin_ultrasonic) * 2;
}

void getUltrasonic() 
{

  int i;
  float ewma_sum = 0;
  for (i = 0; i <= 30; i++)
  {
    val_ultrasonic = analogRead(analogPin_ultrasonic);
    ewma_sum += val_ultrasonic * 2;
  }
  distance_cal = (ewma_sum / 30);
  Serial.println(distance_cal);
}

void Read_Sensor_QQ()
{
  Wire.beginTransmission(channel_ids[ch]);     // call the circuit by its ID number.
  Wire.write('r');                          // request a reading by sending 'r'
  Wire.endTransmission();                         // end the I2C data transmission.
  
  delay(1000);  // AS circuits need a 1 second before the reading is ready

  sensor_bytes_received = 0;                        // reset data counter
  memset(sensordata, 0, sizeof(sensordata));        // clear sensordata array;

  Wire.requestFrom(channel_ids[ch], 48, 1);    // call the circuit and request 48 bytes (this is more then we need).
  code = Wire.read();

  while (Wire.available()) // are there bytes to receive?
  {          
    in_char = Wire.read();            // receive a byte.

    if (in_char == 0) {               // null character indicates end of command
      Wire.endTransmission();         // end the I2C data transmission.
      break;                          // exit the while loop, we're done here
    }
    else {
      sensordata[sensor_bytes_received] = in_char;      // append this byte to the sensor data array.
      sensor_bytes_received++;
    }
  }

  Serial.print("Round : ");
  Serial.print(CountRound);
  Serial.print(" ::::::: ");
  
  Serial.print(channel_names[ch]);   // print channel name
  Serial.print(" : ");

  switch (code)                          // switch case based on what the response code is.
  {                      
    case 1:                             // decimal 1  means the command was successful.
      Serial.println(sensordata);       // print the actual reading
      TimeOnTop();
      display.setTextSize(2);
      display.setTextColor(WHITE);
      display.print("Reading ");
      display.println(CountRound);
      display.print(channel_names[ch]);
      display.print(":");
      display.println(atof(sensordata));
      display.display();
      sensorvalue[ch][CountRound] = atof(sensordata);
      ch++;
      break;                              // exits the switch case.

    case 2:                             // decimal 2 means the command has failed.
      Serial.println("command failed");   // print the error
      CountError[ch]++;
      TimeOnTop();
      display.setTextSize(2);
      display.setTextColor(WHITE);
      display.print("Reading ");
      display.println(CountRound);
      display.print(channel_names[ch]);
      display.print(":");
      display.println("command failed");
      display.display();
      ch++;
      break;                              // exits the switch case.

    case 254:                           // decimal 254  means the command has not yet been finished calculating.
      Serial.println("circuit not ready"); // print the error
      CountError[ch]++;
      TimeOnTop();
      display.setTextSize(2);
      display.setTextColor(WHITE);
      display.print("Reading ");
      display.println(CountRound);
      display.print(channel_names[ch]);
      display.print(":");
      display.println("circuit not ready");
      display.display();
      ch++;
      break;                              // exits the switch case.

    case 255:                           // decimal 255 means there is no further data to send.
      Serial.println("no data");          // print the error
      CountError[ch]++;
      TimeOnTop();
      display.setTextSize(2);
      display.setTextColor(WHITE);
      display.print("Reading ");
      display.println(CountRound);
      display.print(channel_names[ch]);
      display.print(":");
      display.println("NO DATA");
      display.display();
      ch++;
      break;                              // exits the switch case.
  }
}

void Average_Data()
{
  float sum_sensorvalue = 0;
  for (int channel = 0; channel < TOTAL_CIRCUITS; channel++) // loop through all the sensors
  {
    for (int counter = 0; counter < BreakReadData; counter++)
    {
      sum_sensorvalue += sensorvalue[channel][counter];
    }
    Serial.print(channel_names[channel]);   // print channel name
    Serial.print("mean : ");
    result[channel] = sum_sensorvalue / BreakReadData;
    Serial.println(result[channel], TOTAL_CIRCUITS);
    sum_sensorvalue = 0;
  }
}

void SendData_Quality() 
{
  message = "";
  Serial.println("-------------------------------SEND DATA QUALITY------------------------------------------");
  // String URL = "http://nahmchan.oasys-lab.com/getData_waterQQ_station.php?";
  String URL = "http://139.59.251.210/api-qq/send_db_quality.php?";
  // String URL = "http://www.thaiwaterqq.com/api-qq/send_db_quality.php?";
  String field1 = "&StationID=" + StationID;
  String field2 = "&D_O=" + (String)("%.2f",result[0]);
  String field3 = "&pH=" + (String)("%.2f",result[1]);
  String field4 = "&Conductivity=" + (String)("%.2f",result[2]);
  String field5 = "&temp=" + (String)("%.2f",temperate[5]);

  String SendData_string = URL + field1 + field2 + field3 + field4 + field5;

  // Serial.println(SendData_string);

  Serial.println(F("Disconnect net"));
  net.DisConnect();
  Serial.println(F("Set APN and Password"));
  net.Configure(APN, USER, PASS);
  Serial.println(F("Connect net"));
  net.Connect();
  Serial.println(F("Show My IP"));
  Serial.println(net.GetIP());
  Serial.println(F("Start HTTP"));
  http.begin(1);
  Serial.println(F("Send HTTP GET"));
  http.url(SendData_string);
  Serial.println(http.get());
 
  Serial.println(F("Clear data in RAM"));
  file.Delete(RAM,"*");
  Serial.println(F("Save HTTP Response To RAM"));
  http.SaveResponseToMemory(RAM,"web.hml");
  Serial.println(F("Read data in RAM"));
  read_file(RAM,"web.hml");
  
  Serial.println(F("Disconnect net"));
  net.DisConnect();

  if(!testMode)
  {
    NextPinRoutine();
  }

  if(testMode)
  {
    testMode = !testMode;
  }
}

void SendData_ultra()
{
  message = "";
  Serial.println("-------------------------------SEND DATA ULTRASONIC------------------------------------------");
//  String URL = "http://nahmchan.oasys-lab.com/getData_waterQQ_station.php?";
  String URL = "http://139.59.251.210/api-qq/send_db_quantity.php?";
  // String URL = "http://www.thaiwaterqq.com/api-qq/send_db_quantity.php?";
  String field1 = "&StationID=" + StationID;
  String field2 = "&ultra=" + (String)(distance_cal);;

  String SendData_string = URL + field1 + field2;

  // Serial.println(SendData_string);

  Serial.println(F("Disconnect net"));
  net.DisConnect();
  Serial.println(F("Set APN and Password"));
  net.Configure(APN, USER, PASS);
  Serial.println(F("Connect net"));
  net.Connect();
  Serial.println(F("Show My IP"));
  Serial.println(net.GetIP());
  Serial.println(F("Start HTTP"));
  http.begin(1);
  Serial.println(F("Send HTTP GET"));
  http.url(SendData_string);
  Serial.println(http.get());

  Serial.println(F("Clear data in RAM"));
  file.Delete(RAM, "*");
  Serial.println(F("Save HTTP Response To RAM"));
  http.SaveResponseToMemory(RAM, "web.hml");
  Serial.println(F("Read data in RAM"));
  read_message(RAM,"web.hml");

  Serial.println(F("Disconnect net"));
  net.DisConnect();

  StaticJsonBuffer<700> jsonBuffer;
  JsonObject& root = jsonBuffer.parseObject(message);

  if (!root.success()) 
  {
    Serial.println("parseObject() failed");
  }
  else
  {
    delayBeforeReset = root["reset"];
    durationBeforePumpError = root["duration"];
    RainSensor_Overflow = root["overflow"];
    RainSensor_PumpWork = root["work"];
    BreakReadData = root["number_data"];
    mode = root["mode"];
    ultrasonic_routine = root["time_sync"];
    time_routine = root["routine"];
    reset_manual = root["reset_manual"];
    for(int i =0;i<2;i++)
    {
      round_H[i] = root["round_H"][i];
      round_M[i] = root["round_M"][i];  
    }
    saveMode = false;  
  }

  if(testMode)
  {
    testMode = !testMode;
  }

  if(testMode_mode3 && mode == 3)
  {
    testMode_mode3 = !testMode_mode3;
  }
}

void SentError(String error_type,int code_error)
{
  message = "";
  Serial.println("-------------------------------SEND ERROR STATUS------------------------------------------");
  String URL = "http://139.59.251.210/api-qq/send_db_status.php?";
  // String URL = "http://www.thaiwaterqq.com/api-qq/send_db_status.php?";
  String field1 = "&StationID=" + StationID;
  String field2;

  if(error_type == "pump")
  {
    field2 = "&pump=" + code_error;
  }
  else if(error_type == "power_sen")
  {
    field2 = "&power_sen=" + code_error;
  }
  else if(error_type == "ultrasonic")
  {
    field2 = "&ultrasonic=" + code_error;
  }
  else if(error_type == "doxigen")
  {
    field2 = "&doxigen=" + code_error;
  }
  else if(error_type == "ph")
  {
    field2 = "&ph=" + code_error;
  }
  else if(error_type == "conductivity")
  {
    field2 = "&conductivity=" + code_error;
  }
  else if(error_type == "watertemp")
  {
    field2 = "&watertemp=" + code_error;
  }

  String SendData_string = URL + field1 + field2;

  Serial.println(SendData_string);

  Serial.println(F("Disconnect net"));
  net.DisConnect();
  Serial.println(F("Set APN and Password"));
  net.Configure(APN, USER, PASS);
  Serial.println(F("Connect net"));
  net.Connect();
  Serial.println(F("Show My IP"));
  Serial.println(net.GetIP());
  Serial.println(F("Start HTTP"));
  http.begin(1);
  Serial.println(F("Send HTTP GET"));
  http.url(SendData_string);
  Serial.println(http.get());
 
  Serial.println(F("Clear data in RAM"));
  file.Delete(RAM,"*");
  Serial.println(F("Save HTTP Response To RAM"));
  http.SaveResponseToMemory(RAM,"web.hml");
  Serial.println(F("Read data in RAM"));
  read_file(RAM,"web.hml");
  
  Serial.println(F("Disconnect net"));
  net.DisConnect();

}

void Sent_Status(String type)
{
  message = "";
  Serial.println("-------------------------------SEND ACTIVE STATUS------------------------------------------");
  String URL = "http://139.59.251.210/api-qq/send_db_status.php?";
  // String URL = "http://www.thaiwaterqq.com/api-qq/send_db_status.php?";
  String field1 = "&StationID=" + StationID;
  String field2;

  if(type == "pump")
  {
    field2 = "&pump=1";
  }
  else if(type == "power_sen")
  {
    field2 = "&power_sen=1";
  }
  else if(type == "ultrasonic")
  {
    field2 = "&ultrasonic=1";
  }
  else if(type == "doxigen")
  {
    field2 = "&doxigen=1";
  }
  else if(type == "ph")
  {
    field2 = "&ph=1";
  }
  else if(type == "conductivity")
  {
    field2 = "&conductivity=1";
  }
  else if(type == "watertemp")
  {
    field2 = "&watertemp=1";
  }

  String SendData_string = URL + field1 + field2;

  Serial.println(SendData_string);

  Serial.println(F("Disconnect net"));
  net.DisConnect();
  Serial.println(F("Set APN and Password"));
  net.Configure(APN, USER, PASS);
  Serial.println(F("Connect net"));
  net.Connect();
  Serial.println(F("Show My IP"));
  Serial.println(net.GetIP());
  Serial.println(F("Start HTTP"));
  http.begin(1);
  Serial.println(F("Send HTTP GET"));
  http.url(SendData_string);
  Serial.println(http.get());
 
  Serial.println(F("Clear data in RAM"));
  file.Delete(RAM,"*");
  Serial.println(F("Save HTTP Response To RAM"));
  http.SaveResponseToMemory(RAM,"web.hml");
  Serial.println(F("Read data in RAM"));
  read_file(RAM,"web.hml");
  
  Serial.println(F("Disconnect net"));
  net.DisConnect();
}

bool Sync_data()
{
  message ="";
  Serial.println("-------------------------------SYNC DATA------------------------------------------");
  // String url_sync = "http://www.thaiwaterqq.com/api-qq/get_station_config.php?StationID=" + StationID;
  String url_sync = "http://139.59.251.210/api-qq/get_station_config.php?StationID=" + StationID;

  Serial.println(F("Disconnect net"));
  net.DisConnect();
  Serial.println(F("Set APN and Password"));
  net.Configure(APN, USER, PASS);
  Serial.println(F("Connect net"));
  net.Connect();
//  Serial.println(F("Show My IP"));
//  Serial.println(net.GetIP());
  Serial.println(F("Start HTTP"));
  http.begin(1);
  Serial.println(F("Send HTTP GET"));
  http.url(url_sync);
  Serial.println(http.get());
 
  Serial.println(F("Clear data in RAM"));
  file.Delete(RAM,"*");
  Serial.println(F("Save HTTP Response To RAM"));
  http.SaveResponseToMemory(RAM,"web.hml");
  Serial.println(F("Read data in RAM"));
  read_message(RAM,"web.hml");
  
  Serial.println(F("Disconnect net"));
  net.DisConnect();

  StaticJsonBuffer<700> jsonBuffer;
  JsonObject& root = jsonBuffer.parseObject(message);

  if (!root.success()) 
  {
    Serial.println("parseObject() failed");
    return false;
  }
  else
  {
    delayBeforeReset = root["reset"];
    durationBeforePumpError = root["duration"];
    RainSensor_Overflow = root["overflow"];
    RainSensor_PumpWork = root["work"];
    BreakReadData = root["number_data"];
    mode = root["mode"];
    ultrasonic_routine = root["time_sync"];
    time_routine = root["routine"];
    reset_manual = root["reset_manual"];
    for(int i =0;i<2;i++)
    {
      round_H[i] = root["round_H"][i];
      round_M[i] = root["round_M"][i];  
    }  
    return true;
  }

}

bool Sync_time()
{
  message = "";
  Serial.println("-------------------------------SYNC TIME------------------------------------------");
  // String url_sync = "http://www.thaiwaterqq.com/api-qq/sync_time.php";
  String url_sync = "http://139.59.251.210/api-qq/sync_time.php";

  Serial.println(F("Disconnect net"));
  net.DisConnect();
  Serial.println(F("Set APN and Password"));
  net.Configure(APN, USER, PASS);
  Serial.println(F("Connect net"));
  net.Connect();
  Serial.println(F("Show My IP"));
  Serial.println(net.GetIP());
  Serial.println(F("Start HTTP"));
  http.begin(1);
  Serial.println(F("Send HTTP GET"));
  http.url(url_sync);
  Serial.println(http.get());
 
  Serial.println(F("Clear data in RAM"));
  file.Delete(RAM,"*");
  Serial.println(F("Save HTTP Response To RAM"));
  http.SaveResponseToMemory(RAM,"web.hml");
  Serial.println(F("Read data in RAM"));
  read_message(RAM,"web.hml");
  
  Serial.println(F("Disconnect net"));
  net.DisConnect();

  StaticJsonBuffer<200> jsonBuffer;
  JsonObject& root = jsonBuffer.parseObject(message);

  if (!root.success()) 
  {
    Serial.println("parseObject() failed");
    return false;
  }
  else
  {
    // setTime(hr,min,sec,day,month,yr); // Another way to set
//     setTime(20,13,35,10,1,2018); // Another way to set
     int H = root["H"];
     int i = root["i"];
     int s = root["s"];
     int d = root["d"];
     int m = root["m"];
     int Y = root["Y"];
     RTC.adjust(DateTime(Y,m,d,H,i,s));
    return true;
  }

}

void change_mode()
{
  message = "";
  Serial.println("-------------------------------CHANGE MODE------------------------------------------");
  // String url_sync = "http://www.thaiwaterqq.com/api-qq/change_mode.php?StationID=" + StationID + "&mode=1";
  String url_sync = "http://139.59.251.210/api-qq/change_mode.php?StationID=" + StationID + "&mode=1";

  SentError("pump",0);
  Serial.println(F("Disconnect net"));
  net.DisConnect();
  Serial.println(F("Set APN and Password"));
  net.Configure(APN, USER, PASS);
  Serial.println(F("Connect net"));
  net.Connect();
  Serial.println(F("Show My IP"));
  Serial.println(net.GetIP());
  Serial.println(F("Start HTTP"));
  http.begin(1);
  Serial.println(F("Send HTTP GET"));
  http.url(url_sync);
  Serial.println(http.get());
 
  Serial.println(F("Clear data in RAM"));
  file.Delete(RAM,"*");
  Serial.println(F("Save HTTP Response To RAM"));
  http.SaveResponseToMemory(RAM,"web.hml");
  Serial.println(F("Read data in RAM"));
  read_message(RAM,"web.hml");
  
  Serial.println(F("Disconnect net"));
  net.DisConnect();
}

void change_reset()
{
  message = "";
  Serial.println("-------------------------------CHANGE MODE------------------------------------------");
  // String url_sync = "http://www.thaiwaterqq.com/api-qq/change_mode.php?StationID=" + StationID + "&reset=0";
  String url_sync = "http://139.59.251.210/api-qq/change_mode.php?StationID=" + StationID + "&reset=0";

  Serial.println(F("Disconnect net"));
  net.DisConnect();
  Serial.println(F("Set APN and Password"));
  net.Configure(APN, USER, PASS);
  Serial.println(F("Connect net"));
  net.Connect();
  Serial.println(F("Show My IP"));
  Serial.println(net.GetIP());
  Serial.println(F("Start HTTP"));
  http.begin(1);
  Serial.println(F("Send HTTP GET"));
  http.url(url_sync);
  Serial.println(http.get());
 
  Serial.println(F("Clear data in RAM"));
  file.Delete(RAM,"*");
  Serial.println(F("Save HTTP Response To RAM"));
  http.SaveResponseToMemory(RAM,"web.hml");
  Serial.println(F("Read data in RAM"));
  read_message(RAM,"web.hml");
  
  Serial.println(F("Disconnect net"));
  net.DisConnect();
}

void Reset_Board()
{
  Serial.println("-------------------------------RESET BOARD------------------------------------------");
  Start_Flow = false;
  Start_Read_Sensor = false;

  StopPumpWasteWaterIn();
  SentError("pump",0);
  delay(5000);
  if (now.minute() + delayBeforeReset >= 60)
  {
    if (now.hour() == 23)
    {
      TimeResetHour = 0;
    }
    else
    {
      TimeResetHour = now.hour() + 1;
    }
    TimeResetMin = now.minute() + delayBeforeReset - 60;
  }
  else
  {
    TimeResetHour = now.hour();
    TimeResetMin = now.minute() + delayBeforeReset;
  }
  Have_Reset = true;
}


void Software_Reset()
{
  delay(600);
  asm volatile(" jmp 0");
}
