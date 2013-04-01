using System;
using System.Collections.Generic;
using NUnit.Framework;

using CI;

namespace TestCI
{
	[TestFixture]
	public class TestDocumentFiltering
	{
		[Test]
		public void TestGetWords()
		{
			string sample = @"Hello world, 
			I am happy.
			(This is test.)	The hello test.";
			
			Dictionary<string, int> result = DocumentFiltering.GetWords(sample);
			
			Dictionary<string, int> expect = new Dictionary<string, int>()
			{
				{"world", 1},
				{"happy", 1},
				{"this", 1},
				{"the", 1},
				{"hello", 2},
				{"test", 2}
			};
			
			Assert.AreEqual(expect, result);
		}
	}
}	
