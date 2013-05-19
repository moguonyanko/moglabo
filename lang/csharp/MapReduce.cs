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
	
	struct MapEntry : IComparable<MapEntry>, IComparable
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
		
		internal MapEntry(char entryKey, int entryValue)
			: this()
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
			if (o is MapEntry)
			{
				MapEntry entry = (MapEntry)o;
				return entry.Key.Equals(Key);
			}
			else
			{
				return false;
			}
		}
		
		public bool Equals(MapEntry entry)
		{
			return entry.Key.Equals(Key);
		}
		
		public override int GetHashCode()
		{
			return Key;
		}		
		
		public static bool operator ==(MapEntry lhs, MapEntry rhs)
        {
			return lhs.Equals(rhs);
        }

		public static bool operator !=(MapEntry lhs, MapEntry rhs)
        {
			return !(lhs.Equals(rhs));
        }		
		
		public override string ToString()
		{
			return "Key is [" + Key + "], Value is " + Value;
		}				
	}
	
	class MapTask
	{
		public List<MapEntry> Entries
		{
			get;
			private set;
		}
		
		internal MapTask()
		{
			Entries = new List<MapEntry>();
		}
		
		public List<MapEntry> Execute(string target)
		{
			var utf8 = new UTF8Encoding();
			var bytes = utf8.GetBytes(target);
			
			foreach (byte b in bytes)
			{
				var entry = new MapEntry((char)b, 1);
				Entries.Add(entry);
			}
			
			Entries.Sort();
			
			return Entries;
		}
	}
	
	class ReduceTask
	{
		public int Count
		{
			get;
			private set;
		}
		
		internal ReduceTask()
		{
			Count = 0;
		}
		
		public MapEntry Execute(ReduceInput input)
		{
			Count = input.Entries.Count;
			
			return new MapEntry(input.Key, Count);
		}
	}
	
	/// <summary>
	/// Intermediate data.
	/// Maybe this is file on disk.
	/// </summary>
	struct ReduceInput
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
		
		internal ReduceInput(char inputKey)
			: this()
		{
			Key = inputKey;
			Entries = new List<MapEntry>();
		}
	}
	
	class ReduceInputListFactory
	{
		public static List<ReduceInput> CreateInstance(List<MapEntry> entries)
		{
			var instance = new List<ReduceInput>();
			
			MapEntry? current;
			ReduceInput ri;
			
			foreach (var entry in entries)
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
	
	class MapReduceCharCounter
	{
		private Dictionary<char, int> CharCount = new Dictionary<char, int>();
		
		public void Run(string target)
		{
			var map = new MapTask();
			var entries = map.Execute(target);
			
			var reduce = new ReduceTask();
			var inputList = ReduceInputListFactory.CreateInstance(entries);
			
			var results = 
				from input in inputList
				select reduce.Execute(input);
			
			CharCount = results.ToDictionary(result => result.Key, 
				result => result.Value);
		}
		
		public int GetCharCount(char c)
		{
			if (CharCount.ContainsKey(c))
			{
				return CharCount[c];
			}
			else
			{
				return 0;
			}
		}
	}
	
	public class MapReduceCharCounterMain
	{
		static void Main(string[] args)
		{
			var target = "abcaba";
			// var target2 = "abcacbaabbcbacbacbaabbbabcbacbabab";
			
			var counter = new MapReduceCharCounter();
			
			counter.Run(target);
			
			Console.WriteLine("a:" + counter.GetCharCount('a'));
			Console.WriteLine("b:" + counter.GetCharCount('b'));
			Console.WriteLine("c:" + counter.GetCharCount('c'));
		}
	}
}

