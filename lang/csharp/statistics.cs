/**
 * This is statistics library to study mine.
 **/

using System;

namespace Statistics
{
	class StatUtil
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
	
	class TestMain
	{
		static void Main(string[] args)
		{
			double[] sample = {43, 47, 52, 52, 54, 61, 67, 67, 68, 69, 70, 71, 71, 73, 76, 82, 84, 84, 91};
			// double result = StatUtil.Mean(sample);
			// double result1 = StatUtil.SamplingVar(sample);
			// double result2 = StatUtil.UnbiasedVar(sample);
			double result = StatUtil.StdDeviation(sample);
			Console.WriteLine(result);
		
			/*
			if(args.Length > 0)
			{
				Console.WriteLine("Hello, World! and " + args[0]);
			}
			else
			{
				Console.WriteLine("Arguments is nothing...");
			}
			*/
		}
	}
}	
		
