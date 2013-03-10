/**
 * This is statistics library to study mine.
 * Reference:
 * 「意味がわかる統計学（ベレ出版）」
 **/

using System;

namespace Statistics
{
	/**
	 * <summary>
	 * Utillity for statistics.
	 * </summary>
	 **/
	public class StatUtil
	{
		private static double Sum(double[] datas)
		{
			double result = 0;
			
			foreach (double data in datas)
			{
				result += data;
			}
			
			return result;
		}
		
		public static double Mean(double[] datas)
		{
			return Sum(datas) / datas.Length;
		}
		
		private static double Square(double x)
		{
			return x * x;
		}
		
		private static double DeviationSqrtSum(double[] datas)
		{
			double mean = Mean(datas);
			double result = 0;
			
			foreach (double data in datas)
			{
				double devSq = Square(data - mean);
				result += devSq;
			}
			
			return result;			
		}
		
		private static double Var(double[] datas, string type)
		{
			double result = DeviationSqrtSum(datas);
			
			int denominator = 1, dataLen = datas.Length;
			
			if (type == "Sampling")
			{
				denominator = dataLen;
			}
			else if (type == "Unbiased")
			{
				denominator = dataLen - 1;
			}
			else
			{
				throw new ArgumentException("Invalid type name.");
			}
			
			return result / denominator;
		}
		
		public static double SamplingVar(double[] datas)
		{
			return Var(datas, "Sampling");
		}
		
		public static double UnbiasedVar(double[] datas)
		{
			return Var(datas, "Unbiased");
		}
		
		public static double SamplingStdDeviation(double[] datas)
		{
			return Math.Sqrt(SamplingVar(datas));
		}
		
		public static double UnbiasedStdDeviation(double[] datas)
		{
			return Math.Sqrt(UnbiasedVar(datas));
		}
		
		public static double DeviationProductSum(double[] datas1, double[] datas2)
		{
			double mean1 = Mean(datas1);
			double mean2 = Mean(datas2);
		
			int minDatasLen = Math.Min(datas1.Length, datas2.Length);
			
			double result = 0.0;
			
			for (int dataIdx = 0; dataIdx < minDatasLen; dataIdx++)
			{
				double dev1 = datas1[dataIdx] - mean1;
				double dev2 = datas2[dataIdx] - mean2;
				result += dev1 * dev2;
			}
		
			return result;
		}
		
		public static double SamplingCor(double[] datas1, double[] datas2)
		{
			if (datas1.Length <= 0 || datas2.Length <= 0)
			{
				throw new ArgumentException("Cannot handle empty datas.");
			}
		
			double proDevSum = DeviationProductSum(datas1, datas2);
			double proDevSumMean = proDevSum / Math.Min(datas1.Length, datas2.Length);
			
			double sd1 = SamplingStdDeviation(datas1);
			double sd2 = SamplingStdDeviation(datas2);
			
			return proDevSumMean / (sd1 * sd2);
		}
	}
}	
		
