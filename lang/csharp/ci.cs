/**
 * The "Collective Intelligence" library for studying oneself.
 * Reference:
 * 「Programming Collective Intelligence」 By Toby Segaran / Publisher:O'Reilly Media
 **/

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;

using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Driver.Builders;
using MongoDB.Driver.GridFS;
using MongoDB.Driver.Linq;

using Resource;

namespace CI
{
	/// <summary>
	/// Category including a feature. 
	/// </summary>
	internal class Category : IEquatable<Category>
	{
		public ObjectId Id { get; set; }
		
		public string Name
		{
			get;
			private set;
		}
		
		public int Count
		{
			get;
			private set;
		}
		
		public Category(string name, int count)
		{
			Name = name;
			Count = count;
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
		
			Category c = o as Category;
			
			if (c != null)
			{		
				return this.Equals(c);
			}
			else
			{
				return false;
			}
		}
		
		public bool Equals(Category c)
		{
			return Name.Equals(c.Name) && Count == c.Count;
		}
		
		public override int GetHashCode()
		{
			return Name.GetHashCode()^Count;
		}		
		
		public override string ToString()
		{
			return "Caategory name is [" + Name + "], category count is " + Count;
		}	
	}

	/// <summary>
	/// General feature expression. 
	/// </summary>
	internal class Feature : IEquatable<Feature>
	{
		public ObjectId Id { get; set; }
		
		public string Name
		{
			get;
			private set;
		}
		
		public string CategoryName
		{
			get;
			private set;
		}
		
		public int Count
		{
			get;
			private set;
		}		
		
		public Feature(string name, string categoryName, int count)
		{
			Name = name;
			CategoryName = categoryName;
			Count = count;
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
		
			Feature f = o as Feature;
			
			if (f != null)
			{		
				return this.Equals(f);
			}
			else
			{
				return false;
			}
		}
		
		public bool Equals(Feature f)
		{
			return Name.Equals(f.Name) && CategoryName.Equals(f.CategoryName) && Count == f.Count;
		}
		
		public override int GetHashCode()
		{
			return Name.GetHashCode()^CategoryName.GetHashCode()^Count;
		}		
		
		public override string ToString()
		{
			return "Feature term is [" + Name + "], CategoryName is " + 
				CategoryName + ", feature count is " + Count;
		}		
	}
	
	/// <summary>
	/// Basic classifier.
	/// </summary>
	public abstract class Classifier
	{
		internal readonly Func<string, Dictionary<string, int>> GetFeatures;
		private readonly Dictionary<string, Dictionary<string, int>> FeatureOverCatrgoryCount;
		private readonly Dictionary<string, int> CategoryCount;
		
		private const double WEIGHT = 1.0;
		private const double AP = 0.5;
	
		internal readonly Dictionary<string, double> Thresholds;
		
		private readonly string FC = "fc";
		private readonly string CC = "cc";

		/*		
		private enum Tables 
		{
			FC, CC
		};
		*/
		
		/* @TODO: Should not use db class name. */
		private MongoDatabase DB;
		//private IDatabase DB;
	
		public Classifier(Func<string, Dictionary<string, int>> func, string fileName)
		{
			GetFeatures = func;
			FeatureOverCatrgoryCount = new Dictionary<string, Dictionary<string, int>>();
			CategoryCount = new Dictionary<string, int>();
			Thresholds = new Dictionary<string, double>();
		}
		
		public void SetDB(string dbName)
		{
			MongoDBResource res = DatabaseResourceFactory.CheckOut(dbName) as MongoDBResource;
			DB = res.Database;
		}
		
		private void Incf(string feature, string category)
		{
			var collection = DB.GetCollection<Feature>(FC);
			
			var count = FCount(feature, category);
			
			if (count <= 0)
			{
				collection.Insert(new Feature(feature, category, 1));
			}
			else
			{
				var query = Query<Feature>.EQ(f => f.Name, feature);
				var update = Update<Feature>.Set(f => f.Count, count + 1);
				collection.Update(query, update);
			}
		
			/*
			if (!FeatureOverCatrgoryCount.ContainsKey(feature))
			{
				FeatureOverCatrgoryCount[feature] = new Dictionary<string, int>();
			}
			
			if (!FeatureOverCatrgoryCount[feature].ContainsKey(category))
			{
				FeatureOverCatrgoryCount[feature][category] = 0;
			}
			
			FeatureOverCatrgoryCount[feature][category] += 1;
			*/
		}

		private void Incc(string category)
		{
			var collection = DB.GetCollection<Feature>(CC);

			var count = CatCount(category);
			
			if (count <= 0)
			{
				collection.Insert(new Category(category, 1));
			}
			else
			{
				var query = Query<Category>.EQ(c => c.Name, category);
				var update = Update<Category>.Set(c => c.Count, count + 1);
				collection.Update(query, update);
			}
		
			/*
			if (!CategoryCount.ContainsKey(category))
			{
				CategoryCount[category] = 0;
			}
			
			CategoryCount[category] += 1;
			*/
		}

		public double FCount(string feature, string category)
		{
			var collection = DB.GetCollection<Feature>(FC);
			
			return collection.Count();
			
			/*
			if (FeatureOverCatrgoryCount.ContainsKey(feature) && 
			FeatureOverCatrgoryCount[feature].ContainsKey(category))
			{
				double fc = FeatureOverCatrgoryCount[feature][category];
				return fc;
			}
			return 0.0;
			*/
		}

		internal int CatCount(string category)
		{
			var collection = DB.GetCollection<Category>(CC);
			
			return (int)collection.Count();
		
			/*
			if (!CategoryCount.ContainsKey(category))
			{
				return 0;
			}
			
			return CategoryCount[category];
			*/
		}
		
		internal int TotalCount()
		{
			var collection = DB.GetCollection<Category>(CC);
			
			var counts = 
				from record in collection.AsQueryable()
				select record.Count;
				
			//return counts.Aggregate(0, (current, next) => current + next);
			return counts.Sum();
			
			/*
			int total = CategoryCount.Values.Sum();
			return total;
			*/
		}

		internal IEnumerable<string> Categories()
		{
			var collection = DB.GetCollection<Category>(CC);
			
			var catNames = 
				from record in collection.AsQueryable()
				select record.Name;
			
			return catNames;
			
			/*
			return CategoryCount.Keys;
			*/
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
			var fcounts = 
				from cat in Categories()
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
		internal abstract double Prob(string item, string category);

		/// <summary>
		/// Classify method.
		/// </summary>
		public abstract string Classify(string item, string defaultClass);
		
		/// <summary>
		///	Set thresholds each category.
		/// </summary>
		public abstract void SetThresholds(string category, double thres);
		
		/// <summary>
		///	Get thresholds each category.
		/// </summary>
		public abstract double GetThresholds(string category);
		
		/// <summary>
		/// Omit defaultClass version, Classify method.
		/// </summary>
		public string Classify(string item)
		{
			return Classify(item, null);
		}
	}
	
	/// <summary>
	/// Naive Bays classifier.
	/// </summary>
	public class NaiveBays : Classifier
	{
		public NaiveBays(Func<string, Dictionary<string, int>> func, string fileName) 
		: base(func, fileName)
		{
		}
	
		private double DocProb(string item, string category)
		{
			var features = GetFeatures(item);
			
			var weightedProbs = 
				from feature in features
				select WeightedProb(feature.Key, category, FProb);
			
			double prob = weightedProbs.Aggregate((x, y) => x * y);
			
			return prob;
		}
	
		internal override double Prob(string item, string category)
		{
			double cc = CatCount(category);
			double total = TotalCount();
			double categoryProb = cc / total;
			double docp = DocProb(item, category);
			
			return categoryProb * docp;
		}
		
		public override void SetThresholds(string category, double thres)
		{
			Thresholds[category] = thres;
		}

		public override double GetThresholds(string category)
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
			
			var fprobs = 
				from _category in Categories()
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
		
		internal override double Prob(string item, string category)
		{
			var features = GetFeatures(item);
			
			var weightedProbs = 
				from feature in features
				select WeightedProb(feature.Key, category, CProb);
				
			var prob = 	weightedProbs.Aggregate((x, y) => x * y);
			var fscore = -2 * Math.Log(prob);
			
			return InvChi2(fscore, features.Count * 2);
		}
		
		public override void SetThresholds(string category, double minimum)
		{
			Thresholds[category] = minimum;
		}
		
		public override double GetThresholds(string category)
		{
			if (!Thresholds.ContainsKey(category)) 
			{
				return 0;
			}
			
			return Thresholds[category];
		}
		
		public override string Classify(string item, string defaultClass)
		{
			var best = defaultClass;
			var max = 0.0;
			
			foreach (var category in Categories())
			{
				var prob = Prob(item, category);
				
				if (GetThresholds(category) < prob && max < prob)
				{
					best = category;
					max = prob;	
				}
			}
			
			return best;
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

