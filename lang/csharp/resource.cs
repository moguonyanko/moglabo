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
	public interface IDatabase : IDisposable
	{
	}
	
	public class MongoDBResource : IDatabase
	{
		private readonly MongoClient Client;
		private readonly MongoServer Server;
		public MongoDatabase Database
		{
			get;
			private set;
		}
		
		public MongoDBResource(string ConnectionURL, string dbName)
		{
			Client = new MongoClient(ConnectionURL);	
			Server = Client.GetServer();
			Database = Server.GetDatabase(dbName);
		}
	
		public void Dispose()
		{
			/* @TODO: Nothing to do, really? */
		}
	}
	
	public class SQLiteResource : IDatabase
	{
		public void Dispose()
		{
		}
	}
	
	public static class DatabaseResourceFactory
	{
		public static IDatabase CheckOut(string dbName)
		{
			var url = "mongodb://localhost";
			var db = new MongoDBResource(url, dbName);
			
			return db;
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
