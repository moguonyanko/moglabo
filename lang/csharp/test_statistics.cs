using System;
using NUnit.Framework;
using Statistics;

namespace TestStatistics
{
	[TestFixture]
	public class TestStatUtil
	{
		[Test]
		public void TestStdDeviation()
		{
			double[] sample = {43, 47, 52, 52, 54, 61, 67, 67, 68, 69, 70, 71, 71, 73, 76, 82, 84, 84, 91};
			double result = StatUtil.StdDeviation(sample);
			Assert.AreEqual(13.268, Math.Round(result, 3));
		}
	}
}
