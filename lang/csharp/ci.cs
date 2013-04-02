/**
 * This is Collective Intelligence library for studying oneself.
 * Reference:
 * 「集合知プログラミング(O'REILLY)」
 **/

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;

namespace CI
{
	class Feature
	{
		public double Term
		{
			get;
			private set;
		}
		
		public double Count
		{
			get;
			private set;
		}		
		
		internal Feature(string term, int count)
		{
			Team = term;
			Count = count;
		}	
		
		public override bool Equals(object o)
		{
			Feature f = o as Feature;
			
			if (f != null)
			{		
				return Term.Equals(f.Term) && Count == f.Count;
			}
			else
			{
				return false;
			}
		}
		
		public override int GetHashCode()
		{
			return Term.GetHashCode()^Count;
		}		
		
		public override string ToString()
		{
			return "Feature term is [" + term + "], that count is " + Count;
		}		
	}
	
	/// <summary>
	/// Basic classifier class
	/// </summary>
	public class Classifier
	{
		private Func<string, Dictionary<string, int>> GetFeatures;
		private Dictionary<Feature, int> FeatureOverCatrgoryCount;
		private Dictionary<Feature, int> CategoryCount;
	
		public Classifier(Func<string, Dictionary<string, int>> func, string fileName)
		{
			GetFeatures = func;
			FeatureOverCatrgoryCount = new Dictionary<Feature, int>();
			CategoryCount = new Dictionary<Feature, int>();
		}
		
		public void Incf(Feature f, string category)
		{
		}

		public void Incc(string category)
		{
		}

		public int FCount(Feature f, string category)
		{
			return 0;
		}

		public int CatCount(string category)
		{
			return 0;
		}
		
		public int TotalCount()
		{
			return 0;
		}

		public Dictionary<Feature, int>.KeyCollection Categories()
		{
			return null;
		}
		
		public void Train(string item, string category)
		{
		}
		
		public void SampleTrain()
		{
		}
	}
	
	public class DocumentFiltering
	{
		private static bool IsAcceptWord(string word)
		{
			return !string.IsNullOrEmpty(word) && 
					2 < word.Length && word.Length < 20;
		}
	
		public static Dictionary<string, int> GetWords(string doc)
		{
			Dictionary<string, int> result = new Dictionary<string, int>();
			Regex splitter = new Regex(@"[\n\r,.\(\)\s\t]+", RegexOptions.Multiline);
			string[] words = splitter.Split(doc);
			
			var wordRecords = 
				from word in words 
				where IsAcceptWord(word) 
				group word by word.ToLower() into grp 
				orderby grp.Count() 
				select new { Count = grp.Count(), Word = grp.Key };
			
			foreach (var record in wordRecords)
			{
				result.Add(record.Word, record.Count);
			}
			
			return result;
		}
	}
}

