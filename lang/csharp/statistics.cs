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
		
		private static double DeviationSqSum(double[] datas)
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
			double result = DeviationSqSum(datas);
			
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
		
		public static double StdDeviation(double[] datas)
		{
			return Math.Sqrt(UnbiasedVar(datas));
		}
	}
}	
		
