using System;
using NUnit.Framework;
using Statistics;

namespace TestStatistics
{
	[TestFixture]
	public class TestStatUtil
	{
		[Test]
		public void TestUnbiasedStdDeviation()
		{
			double[] sample = {43, 47, 52, 52, 54, 61, 67, 67, 68, 69, 70, 71, 71, 73, 76, 82, 84, 84, 91};
			double result = StatUtil.UnbiasedStdDeviation(sample);
			Assert.AreEqual(13.268, Math.Round(result, 3));
		}
		
		[Test]
		public void TestSamplingCor()
		{
			double[] datas1 = {29, 29, 30, 32, 33, 32, 31, 26, 28, 31};
			double[] datas2 = {326, 364, 283, 369, 417, 436, 438, 296, 263, 389};
			double result = StatUtil.SamplingCor(datas1, datas2);
			Assert.AreEqual(0.7600, Math.Round(result, 4));
		}
		
		[Test]
		[ExpectedException(typeof(ArgumentException))]
		public void TestSamplingCorArgumentException()
		{
			double[] datas1 = {};
			double[] datas2 = {};
			StatUtil.SamplingCor(datas1, datas2);
		}
	}
}
