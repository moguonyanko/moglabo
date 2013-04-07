/**
 * The "Collective Intelligence" library for studying oneself.
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
	/// Basic classifier
	/// </summary>
	public class Classifier
	{
		protected readonly Func<string, Dictionary<string, int>> GetFeatures;
		private readonly Dictionary<string, Dictionary<string, int>> FeatureOverCatrgoryCount;
		private readonly Dictionary<string, int> CategoryCount;
		
		private readonly double Weight = 1.0;
		private readonly double Ap = 0.5;
	
		public Classifier(){ }	
	
		public Classifier(Func<string, Dictionary<string, int>> func, string fileName)
		{
			GetFeatures = func;
			FeatureOverCatrgoryCount = new Dictionary<string, Dictionary<string, int>>();
			CategoryCount = new Dictionary<string, int>();
		}
		
		private void Incf(string feature, string category)
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

		private void Incc(string category)
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

		internal int CatCount(string category)
		{
			if (!CategoryCount.ContainsKey(category))
			{
				return 0;
			}
			
			return CategoryCount[category];
		}
		
		internal int TotalCount()
		{
			int total = CategoryCount.Values.Sum();
			return total;
		}

		internal Dictionary<string, int>.KeyCollection Categories()
		{
			return CategoryCount.Keys;
		}
		
		public double FProb(string feature, string category)
		{
			int catcnt = CatCount(category);
			if (catcnt == 0)
			{
				return 0.0;
			}
			
			return FCount(feature, category) / catcnt;
		}
		
		public double WeightedProb(string feature, string category, Func<string, string, double> probFunc)
		{
			double nowProb = probFunc(feature, category);
			
			double totals = 0.0;
			foreach (var cat in Categories()) /* @TODO: use LINQ; */
			{
				totals += FCount(feature, cat);
			}
			
			double bp = ((Weight * Ap) + (totals * nowProb)) / (Weight + totals);
			
			return bp;
		}
		
		public void Train(string sample, string category)
		{
			var features = GetFeatures(sample);
			
			foreach (var feature in features) /* @TODO: use LINQ; */
			{
				Incf(feature.Key, category);
			}
			Incc(category);
		}
		
		/* for test */
		public void SampleTrain()
		{
			Train("Nobady owns the water.", "good");
			Train("the quick rabbit jumps fences.", "good");
			Train("buy pharmaceuticals now", "bad");
			Train("make quick money at the online casino", "bad");
			Train("the quick brown fox jumps", "good");
		}
	}
	
	/// <summary>
	/// Naive Bays classifier
	/// </summary>
	public class NaiveBays : Classifier
	{
		private Dictionary<string, double> Thresholds;
	
		public NaiveBays(Func<string, Dictionary<string, int>> func, string fileName) 
		: base(func, fileName)
		{
			Thresholds = new Dictionary<string, double>();
		}
	
		private double DocProb(string item, string category)
		{
			var features = GetFeatures(item);
			
			double prob = 1.0;
			foreach (var feature in features)
			{
				prob *= WeightedProb(feature.Key, category, FProb);
			}
			
			return prob;
		}
	
		public double Prob(string item, string category)
		{
			double cc = CatCount(category);
			double total = TotalCount();
			double categoryProb = cc / total;
			double docp = DocProb(item, category);
			
			return categoryProb * docp;
		}
		
		public void SetThresholds(string category, double t)
		{
			Thresholds[category] = t;
		}

		public double GetThresholds(string category)
		{
			if (!Thresholds.ContainsKey(category))
			{
				return 1.0;
			}
		
			return Thresholds[category];
		}
		
		public string Classify(string item, string defaultClass)
		{
			var probs = new Dictionary<string, double>();
			
			double max = 0.0;
			string best = defaultClass;
			foreach (string category in Categories())
			{
				probs[category] = Prob(item, category);
				if (probs[category] > max)
				{
					max = probs[category];
					best = category;
				}
			}
			
			foreach (string category in probs.Keys)
			{
				if (category.Equals(best))
				{
					continue;
				}
				
				if (probs[category] * GetThresholds(best) > probs[best])
				{
					return defaultClass;		
				}
			}
			
			return best;
		}
	}
	
	/// <summary>
	/// Document filtering function
	/// </summary>
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

