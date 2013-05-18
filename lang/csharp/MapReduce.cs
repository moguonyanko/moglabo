/**
 * This code is to cultivate a better understanding "MapReduce".
 * Reference:
 * 「GoogleのMapReduceアルゴリズムをJavaで理解する」
 * http://www.atmarkit.co.jp/fjava/special/distributed01/distributed01_1.html
 **/
 
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Algorithm {
	
	public class MapEntry : IComparable<MapEntry>, IComparable
	{
		public char Key
		{
			get;
			private set;
		}
		
		public int Value
		{
			get;
			private set;
		}
		
		public MapEntry(char entryKey, int entryValue)
		{
			Key = entryKey;
			Value = entryValue;
		}
		
		public int CompareTo(MapEntry other)
		{
			return other.Key - Key;
		}
		
		int IComparable.CompareTo(object obj)
		{
			if (obj is MapEntry)
			{
				MapEntry other = (MapEntry)obj;
				return CompareTo(other);
			}
			else
			{
				throw new ArgumentException("Compare target is not MapEntry.");
			}
		}
		
		public override bool Equals(object o)
		{
			if (object.ReferenceEquals(o, null))
			{
				return false;
			}

			if (object.ReferenceEquals(this, o))
			{
				return true;
			}
		
			MapEntry entry = o as MapEntry;
			
			if (entry != null)
			{		
				return this.Equals(entry);
			}
			else
			{
				return false;
			}
		}
		
		private bool Equals(MapEntry entry)
		{
			return entry.Key.Equals(Key);
		}
		
		public override int GetHashCode()
		{
			return Key;
		}		
		
		public override string ToString()
		{
			return "Key is [" + Key + "], Value is " + Value;
		}				
	}
	
	public class MapTask
	{
		public List<MapEntry> Entries
		{
			get;
			private set;
		}
		
		public MapTask()
		{
			Entries = new List<MapEntry>();
		}
		
		public void Execute(string target)
		{
			UTF8Encoding utf8 = new UTF8Encoding();
			byte[] bytes = utf8.GetBytes(target);
			foreach (byte b in bytes)
			{
				MapEntry entry = new MapEntry((char)b, 1);
				Entries.Add(entry);
			}
		}
	}
	
	public class ReduceTask
	{
		public int Count
		{
			get;
			private set;
		}
		
		public ReduceTask()
		{
			Count = 0;
		}
		
		public void Execute(ReduceInput input)
		{
			Count = 0;
			foreach (MapEntry entry in input.Entries)
			{
				Count++;
			}
			MapReduceCharCounter.emit(input, Count);
		}
	}
	
	public class ReduceInput
	{
		public char Key
		{
			get;
			private set;
		}
		
		public List<MapEntry> Entries
		{
			get;
			private set;
		}
		
		public ReduceInput(char inputKey)
		{
			Key = inputKey;
			Entries = new List<MapEntry>();
		}
	}
	
	public class ReduceInputListFactory
	{
		public static List<ReduceInput> CreateInstance(List<MapEntry> entries)
		{
			List<ReduceInput> instance = new List<ReduceInput>();
			
			MapEntry current = null;
			ReduceInput ri = null;
			
			foreach (MapEntry entry in entries)
			{
				if (!entry.Equals(current))
				{
					current = entry;
					ri = new ReduceInput(entry.Key);
					instance.Add(ri);
				}
				ri.Entries.Add(entry);
			}
			
			return instance;
		}
	}
	
	public class MapReduceCharCounter
	{
		private static int[] CharCount = new int[128];
		
		public static void emit(ReduceInput input, int count)
		{
			CharCount[input.Key] = count;
		}
		
		public void Count(string target)
		{
			CharCount = new int[128];
			
			MapTask map = new MapTask();
			map.Execute(target);
			map.Entries.Sort();
			
			ReduceTask reduce = new ReduceTask();
			List<ReduceInput> inputList = ReduceInputListFactory.CreateInstance(map.Entries);
			foreach (ReduceInput input in inputList)
			{
				reduce.Execute(input);
			}
		}
		
		public int GetCharCount(char c)
		{
			int index = (int)c;
			return CharCount[index];
		}
	}
	
	public class MapReduceCharCounterApp
	{
		static void Main(string[] args)
		{
			MapReduceCharCounter counter = new MapReduceCharCounter();
			counter.Count("abcaba");
			// counter.Count("abcacbaabbcbacbacbaabbbabcbacbabab");
			Console.WriteLine("a:" + counter.GetCharCount('a'));
			Console.WriteLine("b:" + counter.GetCharCount('b'));
			Console.WriteLine("c:" + counter.GetCharCount('c'));
		}
	}
}

