import datetime
import MySQLdb
import urllib, json
import ConfigParser
import os
cwd =  os.path.dirname(os.path.realpath(__file__))

# --------- read file config database ----------
Config = ConfigParser.ConfigParser()
Config.read(cwd+'/config.txt')
username = Config.get('Database','username')
password = Config.get('Database','password')
db_name = Config.get('Database','db_name')
# -------------------------------------

# Get data form Current connect to check respond time
db = MySQLdb.connect("localhost",username,password,db_name )
cursor = db.cursor()
sql = "SELECT * FROM station_status"
cursor.execute(sql)

timenow = datetime.datetime.now()
results = cursor.fetchall()
for row in results:
	if row[1] == 0 and row[2] != None:
		if ((timenow-row[2]) <= datetime.timedelta(minutes = 2)):
			sql = "SELECT * FROM station_error_log WHERE station = '%d' and time_error = '%s' " % (row[0],str(row[2]))
			cursor.execute(sql)
			if(int(cursor.rowcount) == 0):
				sql = "INSERT INTO station_error_log VALUES('%s','%d','%d','%d','%d','%d','%d','%d','%d','%f')" % (str(row[2]),row[0],row[1],row[3],row[5],row[7],row[9],row[11],row[13],row[15])
				cursor.execute(sql)
	if row[3] == 0 and row[4] != None:
		if ((timenow-row[4]) <= datetime.timedelta(minutes = 2)):
			sql = "SELECT * FROM station_error_log WHERE station = '%d' and time_error = '%s' " % (row[0],str(row[4]))
			cursor.execute(sql)
			if(int(cursor.rowcount) == 0):
				sql = "INSERT INTO station_error_log VALUES('%s','%d','%d','%d','%d','%d','%d','%d','%d','%f')" % (str(row[4]),row[0],row[1],row[3],row[5],row[7],row[9],row[11],row[13],row[15])
				cursor.execute(sql)
	if row[5] == 0 and row[6] != None:
		if ((timenow-row[6]) <= datetime.timedelta(minutes = 2)):
			sql = "SELECT * FROM station_error_log WHERE station = '%d' and time_error = '%s' " % (row[0],str(row[6]))
			cursor.execute(sql)
			if(int(cursor.rowcount) == 0):
				sql = "INSERT INTO station_error_log VALUES('%s','%d','%d','%d','%d','%d','%d','%d','%d','%f')" % (str(row[6]),row[0],row[1],row[3],row[5],row[7],row[9],row[11],row[13],row[15])
				cursor.execute(sql)
	if row[7] == 0 and row[8] != None:
		if ((timenow-row[8]) <= datetime.timedelta(minutes = 2)):
			sql = "SELECT * FROM station_error_log WHERE station = '%d' and time_error = '%s' " % (row[0],str(row[8]))
			cursor.execute(sql)
			if(int(cursor.rowcount) == 0):
				sql = "INSERT INTO station_error_log VALUES('%s','%d','%d','%d','%d','%d','%d','%d','%d','%f')" % (str(row[8]),row[0],row[1],row[3],row[5],row[7],row[9],row[11],row[13],row[15])
				cursor.execute(sql)
	if row[9] == 0 and row[10] != None:
		if ((timenow-row[10]) <= datetime.timedelta(minutes = 2)):
			sql = "SELECT * FROM station_error_log WHERE station = '%d' and time_error = '%s' " % (row[0],str(row[10]))
			cursor.execute(sql)
			if(int(cursor.rowcount) == 0):
				sql = "INSERT INTO station_error_log VALUES('%s','%d','%d','%d','%d','%d','%d','%d','%d','%f')" % (str(row[10]),row[0],row[1],row[3],row[5],row[7],row[9],row[11],row[13],row[15])
				cursor.execute(sql)
	if row[11] == 0 and row[12] != None:
		if ((timenow-row[12]) <= datetime.timedelta(minutes = 2)):
			sql = "SELECT * FROM station_error_log WHERE station = '%d' and time_error = '%s' " % (row[0],str(row[12]))
			cursor.execute(sql)
			if(int(cursor.rowcount) == 0):
				sql = "INSERT INTO station_error_log VALUES('%s','%d','%d','%d','%d','%d','%d','%d','%d','%f')" % (str(row[12]),row[0],row[1],row[3],row[5],row[7],row[9],row[11],row[13],row[15])
				cursor.execute(sql)
	if row[13] == 0 and row[14] != None:
		if ((timenow-row[14]) <= datetime.timedelta(minutes = 2)):
			sql = "SELECT * FROM station_error_log WHERE station = '%d' and time_error = '%s' " % (row[0],str(row[14]))
			cursor.execute(sql)
			if(int(cursor.rowcount) == 0):
				sql = "INSERT INTO station_error_log VALUES('%s','%d','%d','%d','%d','%d','%d','%d','%d','%f')" % (str(row[14]),row[0],row[1],row[3],row[5],row[7],row[9],row[11],row[13],row[15])
				cursor.execute(sql)
	# if row[15] == 0:
	# 	if ((timenow-row[16]) >= datetime.timedelta(minutes = 2)):
	# 		sql = "SELECT * FROM station_error_log WHERE station = '%d' and time_error = '%s' " % (row[0],str(row[16]))
	# 		print sql
	# 		cursor.execute(sql)
	# 		if(int(cursor.rowcount) == 0):
	# 			sql = "INSERT INTO station_error_log VALUES('%s','%d','%d','%d','%d','%d','%d','%d','%d','%f')" % (str(row[16]),row[0],row[1],row[3],row[5],row[7],row[9],row[11],row[13],row[15])
	# 			cursor.execute(sql)