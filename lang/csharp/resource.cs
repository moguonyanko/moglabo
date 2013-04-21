/**
 * Resouece management module.
 * Reference:
 * 「Programming Collective Intelligence」 By Toby Segaran / Publisher:O'Reilly Media
 **/

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;

using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Driver.Builders;
using MongoDB.Driver.GridFS;
using MongoDB.Driver.Linq;

namespace Resource
{
	interface IDatabase : IDisposable
	{
	}
	
	internal class MongoDBResource : IDatabase
	{
		public void Dispose()
		{
		}
	}
	
	internal class SQLiteResource : IDatabase
	{
		public void Dispose()
		{
		}
	}

	public class ResoueceUtil
	{
		// fot test
		public static string GetMongoDBString()
		{
			/* Sample code from MongoDB official site */
			var connectionString = "mongodb://localhost";
			var client = new MongoClient(connectionString);	
			var server = client.GetServer();
			var database = server.GetDatabase("test"); // "test" is the name of the database
			
			return database.ToString();
		}
	}
}
