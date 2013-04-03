/**
 * This is "Collective Intelligence" library for studying oneself.
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
	public class Feature
	{
		public string Term
		{
			get;
			private set;
		}
		
		public int Count
		{
			get;
			private set;
		}		
		
		public Feature(string term, int count)
		{
			Term = term;
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
			return "Feature term is [" + Term + "], that count is " + Count;
		}		
	}
	
	/// <summary>
	/// Basic classifier class
	/// </summary>
	public class Classifier
	{
		private Func<string, Dictionary<string, int>> GetFeatures;
		private Dictionary<string, Dictionary<string, int>> FeatureOverCatrgoryCount;
		private Dictionary<string, int> CategoryCount;
	
		public Classifier(Func<string, Dictionary<string, int>> func, string fileName)
		{
			GetFeatures = func;
			FeatureOverCatrgoryCount = new Dictionary<string, Dictionary<string, int>>();
			CategoryCount = new Dictionary<string, int>();
		}
		
		public void Incf(string feature, string category)
		{
			if (!FeatureOverCatrgoryCount.ContainsKey(feature))
			{
				FeatureOverCatrgoryCount[feature] = new Dictionary<string, int>();
			}
			
			if (!FeatureOverCatrgoryCount[feature].ContainsKey(category))
			{
				FeatureOverCatrgoryCount[feature][category] = 0;
			}
			
			FeatureOverCatrgoryCount[feature][category] += 1;
		}

		public void Incc(string category)
		{
			if (!CategoryCount.ContainsKey(category))
			{
				CategoryCount[category] = 0;
			}
			
			CategoryCount[category] += 1;
		}

		public double FCount(string feature, string category)
		{
			if (FeatureOverCatrgoryCount.ContainsKey(feature) && 
			FeatureOverCatrgoryCount[feature].ContainsKey(category))
			{
				double fc = FeatureOverCatrgoryCount[feature][category];
				return fc;
			}
			return 0.0;
		}

		public int CatCount(string category)
		{
			return 0;
		}
		
		public int TotalCount()
		{
			return 0;
		}

		public Dictionary<string, int>.KeyCollection Categories()
		{
			return null;
		}
		
		public void Train(string sample, string category)
		{
			var features = GetFeatures(sample);
			
			foreach (var feature in features)
			{
				Incf(feature.Key, category);
			}
			Incc(category);
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

