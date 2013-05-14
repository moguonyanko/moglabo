using System;
using System.Collections.Generic;

namespace DecisionTree
{
	public class DecisionNode
	{
		private int TestIndex;
		private int NeedValue;
		private Dictionary<string, string> Results = new Dictionary<string, string>();
		private DecisionNode TrueNode;
		private DecisionNode FalseNode;

		public DecisionNode(int testIndex, int needValue, Dictionary<string, string> results, 
		                    DecisionNode trueNode, DecisionNode falseNode)
		{
			TestIndex = testIndex;
			NeedValue = needValue;
			Results = results;
			TrueNode = trueNode;
			FalseNode = falseNode;
		}
	}
}

