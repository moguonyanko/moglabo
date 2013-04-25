// LoadAssembly("./MongoDB.Bson.dll");
// LoadAssembly("./MongoDB.Driver.dll");

using System;
using System.Collections.Generic;

using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Driver.Builders;
using MongoDB.Driver.GridFS;
using MongoDB.Driver.Linq;

namespace MongoSimpleTest
{
	class TestMain
	{
		static void Main(string[] args)
		{
			var client = new MongoClient("mongodb://locanlhost");
			var server = client.GetServer();
			var db = server.GetDatabase("cistore");	
			var collection = db.GetCollection("features");
			//var collection = db.GetCollection<TDocument>("features");
			
			Console.WriteLine(collection);
			Console.WriteLine(collection.Settings);
		}
	}
}

