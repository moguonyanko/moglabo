using System;
using System.Collections.Generic;
using NUnit.Framework;

using CI;

namespace TestCI
{
	[TestFixture]
	public class TestDocumentFiltering
	{
		private const int FIX = 4;
	
		[SetUp]
		public void Init()
		{
		}
	
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
		
		/*
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
			CIUtil.SampleTrain(cl);
			double result = cl.FProb("quick", "good");
			double expect = 0.66666666666666;
			int fix = 4;
			Assert.AreEqual(Math.Round(expect, fix), Math.Round(result, fix));
		}
		
		[Test]
		public void TestWeightedProb()
		{
			Classifier cl = new Classifier(DocumentFiltering.GetWords, null);
			CIUtil.SampleTrain(cl);
			double result = cl.WeightedProb("money", "good", cl.FProb);
			CIUtil.SampleTrain(cl);
			result = cl.WeightedProb("money", "good", cl.FProb);
			double expect = 0.16666666666666;
			int fix = 4;
			Assert.AreEqual(Math.Round(expect, fix), Math.Round(result, fix));
		}
		*/
		
		[Test]
		public void TestNaiveBaysProb()
		{
			int fix = 4;
			NaiveBays nb = new NaiveBays(DocumentFiltering.GetWords, null);
			CIUtil.SampleTrain(nb);
			double expect0 = 0.1562499;
			double result0 = nb.Prob("quick rabbit", "good");
			double expect1 = 0.0500000;
			double result1 = nb.Prob("quick rabbit", "bad");
			//Assert.AreEqual(expect0, result0);
			//Assert.AreEqual(expect1, result1);
			Assert.AreEqual(Math.Round(expect0, fix), Math.Round(result0, fix));
			Assert.AreEqual(Math.Round(expect1, fix), Math.Round(result1, fix));
		}
		
		[Test]
		public void TestNaiveBaysClassify()
		{
			NaiveBays nb = new NaiveBays(DocumentFiltering.GetWords, null);
			CIUtil.SampleTrain(nb);
			string defclass = "unknown";
			
			string result0 = nb.Classify("quick rabbit", defclass);
			string result1 = nb.Classify("quick money", defclass);
			
			nb.SetThresholds("bad", 3.0);
			
			/* badに分類されるしきい値が上がったためbadに分類されなくなる */
			string result2 = nb.Classify("quick money", defclass);
			
			for (int i = 0; i < 10; i++) CIUtil.SampleTrain(nb);

			/* トレーニングが積まれたためbadに分類できるようになる。 */
			string result3 = nb.Classify("quick money", defclass);
			
			Assert.AreEqual("good", result0);
			Assert.AreEqual("bad", result1);
			Assert.AreEqual("unknown", result2);
			Assert.AreEqual("bad", result3);
		}
		
		[Test]
		public void TestCProb()
		{
			int fix = 4;
		
			FisherClassifier fc = new FisherClassifier(DocumentFiltering.GetWords, null);
			CIUtil.SampleTrain(fc);
			double result0 = fc.CProb("quick", "good");
			double result1 = fc.CProb("money", "bad");
			double result2 = fc.WeightedProb("money", "bad", fc.CProb);
			Assert.AreEqual(0.5714, Math.Round(result0, fix));
			Assert.AreEqual(1.0, result1);
			Assert.AreEqual(0.75, result2);
		}
		
		[Test]
		public void TestFisherProb()
		{
			FisherClassifier fc = new FisherClassifier(DocumentFiltering.GetWords, null);
			CIUtil.SampleTrain(fc);
			//fc.CProb("quick", "good");
			double result0 = fc.Prob("quick rabbit", "good");
			double result1 = fc.Prob("quick rabbit", "bad");
			Assert.AreEqual(0.7801, Math.Round(result0, FIX));
			Assert.AreEqual(0.3563, Math.Round(result1, FIX));
		}
		
		[TearDown]
		public void Dispose()
		{
		}
	}
}	
