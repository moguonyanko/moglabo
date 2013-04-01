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

