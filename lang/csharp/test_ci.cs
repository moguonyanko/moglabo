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
		
		[Test]
		public void TestTrain()
		{
			Classifier cl = new Classifier(DocumentFiltering.GetWords, null);
			cl.Train("the quick brown fox jumps over the lazy dog", "good");
			cl.Train("make quick money in the online casino", "bad");
			double goodfc = cl.FCount("quick", "good");
			double badfc = cl.FCount("quick", "bad");
			Assert.AreEqual(1.0, goodfc);
			Assert.AreEqual(1.0, badfc);
		}
		
		[Test]
		public void TestFProb()
		{
			Classifier cl = new Classifier(DocumentFiltering.GetWords, null);
			cl.SampleTrain();
			double result = cl.FProb("quick", "good");
			double expect = 0.66666666666666;
			int fix = 4;
			Assert.AreEqual(Math.Round(expect, fix), Math.Round(result, fix));
		}
		
		[Test]
		public void TestWeightedProb()
		{
			Classifier cl = new Classifier(DocumentFiltering.GetWords, null);
			cl.SampleTrain();
			double result = cl.WeightedProb("money", "good", cl.FProb);
			cl.SampleTrain();
			result = cl.WeightedProb("money", "good", cl.FProb);
			double expect = 0.16666666666666;
			int fix = 4;
			Assert.AreEqual(Math.Round(expect, fix), Math.Round(result, fix));
		}
	}
}	
