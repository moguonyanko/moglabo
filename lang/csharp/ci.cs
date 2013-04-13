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
	/// Basic classifier.
	/// </summary>
	public abstract class Classifier
	{
		protected readonly Func<string, Dictionary<string, int>> GetFeatures;
		private readonly Dictionary<string, Dictionary<string, int>> FeatureOverCatrgoryCount;
		private readonly Dictionary<string, int> CategoryCount;
		
		private const double WEIGHT = 1.0;
		private const double AP = 0.5;
	
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
			var fcounts = from cat in Categories()
										select FCount(feature, cat);
										
			double totals = fcounts.Sum();
			double nowProb = probFunc(feature, category);
			
			double weightedProb = ((WEIGHT * AP) + (totals * nowProb)) / (WEIGHT + totals);
			
			return weightedProb;
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
		
		/// <summary>
		/// Get Probability the item in category.
		/// </summary>
		public abstract double Prob(string item, string category);

		/// <summary>
		/// Classify method.
		/// </summary>
		public abstract string Classify(string item, string defaultClass);
	}
	
	/// <summary>
	/// Naive Bays classifier.
	/// </summary>
	public class NaiveBays : Classifier
	{
		private readonly Dictionary<string, double> Thresholds;
	
		public NaiveBays(Func<string, Dictionary<string, int>> func, string fileName) 
		: base(func, fileName)
		{
			Thresholds = new Dictionary<string, double>();
		}
	
		private double DocProb(string item, string category)
		{
			var features = GetFeatures(item);
			
			var weightedProbs = from feature in features
												select WeightedProb(feature.Key, category, FProb);
			
			double prob = weightedProbs.Aggregate((x, y) => x * y);
			
			return prob;
		}
	
		public override double Prob(string item, string category)
		{
			double cc = CatCount(category);
			double total = TotalCount();
			double categoryProb = cc / total;
			double docp = DocProb(item, category);
			
			return categoryProb * docp;
		}
		
		public void SetThresholds(string category, double thres)
		{
			Thresholds[category] = thres;
		}

		public double GetThresholds(string category)
		{
			if (!Thresholds.ContainsKey(category))
			{
				return 1.0;
			}
		
			return Thresholds[category];
		}
		
		public override string Classify(string item, string defaultClass)
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
				if (!category.Equals(best) && probs[category] * GetThresholds(best) > probs[best])
				{
					return defaultClass;		
				}
			}
			
			return best;
		}
	}
	
	/// <summary>
	/// Fisher method classifier.
	/// </summary>
	public class FisherClassifier : Classifier
	{
		public FisherClassifier(Func<string, Dictionary<string, int>> func, string fileName) 
		: base(func, fileName)
		{
		}
		
		public double CProb(string feature, string category)
		{
			var clf = FProb(feature, category);
			
			if (clf == 0) 
			{
				return 0;
			}
			
			var fprobs = from _category in Categories()
											select FProb(feature, _category);
									
			var freqsum = fprobs.Sum();			
			var cprob = clf / freqsum;
			
			return cprob;
		}
		
		private double InvChi2(double chi, int df)
		{
			var m = chi / 2.0;
			var sum = Math.Exp(-m);
			var term = sum;
			
			foreach (int i in Enumerable.Range(1, df / 2))
			{
				term *= m / i;
				sum += term;
			}
			
			return Math.Min(sum, 1.0);
		}
		
		public override double Prob(string item, string category)
		{
			var features = GetFeatures(item);
			
			var weightedProbs = from feature in features
															select WeightedProb(feature.Key, category, CProb);
															
			var prob = 	weightedProbs.Aggregate((x, y) => x * y);
			var fscore = -2 * Math.Log(prob);
			
			return InvChi2(fscore, features.Count * 2);
		}
		
		public override string Classify(string item, string defaultClass)
		{
			return "";
		}		
	}
	
	/// <summary>
	/// Document filtering function class.
	/// </summary>
	public static class DocumentFiltering
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
			
			//result = wordRecords.ToDictionary(record => record.Word);
			
			foreach (var record in wordRecords)
			{
				result.Add(record.Word, record.Count);
			}
			
			return result;
		}
	}
	
	public static class CIUtil
	{
		public static void SampleTrain(Classifier cl)
		{
			cl.Train("Nobady owns the water.", "good");
			cl.Train("the quick rabbit jumps fences.", "good");
			cl.Train("buy pharmaceuticals now", "bad");
			cl.Train("make quick money at the online casino", "bad");
			cl.Train("the quick brown fox jumps", "good");
		}
	}
}

