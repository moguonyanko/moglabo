using System;
using System.Collections.Generic;
using NUnit.Framework;

using Resource;

namespace TestResource
{
	[TestFixture]
	public class TestDatabaseManagement
	{
		[SetUp]
		public void Init()
		{
		}
		
		[Test]
		public void TestGetMongoDBString()
		{
			string expect = "test";
			string result = ResoueceUtil.GetMongoDBString();
			Assert.AreEqual(expect, result);
		}
		
		[TearDown]
		public void Dispose()
		{
		}
	}
}

