/**
 * This is statistics library to study mine.
 **/

using System;

namespace Statistics
{
	class StatUtil
	{
		private static int Sum(int[] datas)
		{
			int result = 0;
			
			foreach(int data in datas)
			{
				result += data;
			}
			
			return result;
		}
		
		public static int Mean(int[] datas)
		{
			return Sum(datas) / datas.Length;
		}
	}
	
	class TestMain
	{
		static void Main(string[] args)
		{
			int[] sample = {1, 2, 3, 4, 5};
			int result = StatUtil.Mean(sample);
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
		
