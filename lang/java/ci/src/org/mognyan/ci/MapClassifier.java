package org.mognyan.ci;

import java.util.*;

import org.mognyan.ci.filter.WordFilterTask;
import org.mognyan.ci.probability.WordProbability;

public abstract class MapClassifier implements Classifier {

	private final WordFilterTask task;
	private final Map<String, Map<String, Integer>> wordOverCategoryCount = new HashMap<>();
	private final Map<String, Integer> categoryCount = new HashMap<>();
	private final static double WEIGHT = 1.0;
	private final static double AP = 0.5;
	private final Map<String, Integer> thresholds = new HashMap<>();
	
	private final WordProbability DEFAULT_PROBABILITY = new WordProbability(){
		@Override
		public double prob(String word, String categoryName){
			int catCount = getCategoryCount(categoryName);

			if(catCount > 0){
				return getFeatureCount(word, categoryName) / catCount;
			}else{
				return 0.0;
			}
		}
	};

	public MapClassifier(WordFilterTask task) {
		this.task = task;
	}

	private void incFeatureCount(String word, String categoryName) {
		if (!wordOverCategoryCount.containsKey(word)) {
			wordOverCategoryCount.put(word, new HashMap<String, Integer>());
		}

		Map<String, Integer> tmpWordCount = wordOverCategoryCount.get(word);

		if (!tmpWordCount.containsKey(categoryName)) {
			tmpWordCount.put(categoryName, 0);
		}

		int nowCount = tmpWordCount.get(categoryName) + 1;
		tmpWordCount.put(categoryName, nowCount + 1);
		wordOverCategoryCount.put(word, tmpWordCount);
	}

	private void incCategoryCount(String categoryName) {
		if (!categoryCount.containsKey(categoryName)) {
			categoryCount.put(categoryName, 0);
		}

		int nowCount = categoryCount.get(categoryName);
		categoryCount.put(categoryName, nowCount + 1);
	}
	
	double getFeatureCount(String word, String categoryName){
		if (wordOverCategoryCount.containsKey(word) && 
			wordOverCategoryCount.get(word).containsKey(categoryName)) {
			double fc = wordOverCategoryCount.get(word).get(categoryName);
			return fc;
		}else{
			return 0.0;
		}
	}
	
	int getCategoryCount(String categoryName){
		if (categoryCount.containsKey(categoryName)) {
			return categoryCount.get(categoryName);
		} else {
			return 0;
		}
	}
	
	int getTotalCount(){
		Collection<Integer> counts = categoryCount.values();
		
		int total = 0;
		
		for (Integer count : counts) {
			total += Integer.valueOf(count);
		}
		
		return total;
	}
	
	Set<String> getCategories(){
		return categoryCount.keySet();
	}
	
	double featureProb(String word, String categoryName){
		int catCount = getCategoryCount(categoryName);
		
		if (catCount > 0) {
			return getFeatureCount(word, categoryName) / catCount;
		}else{
			return 0.0;
		}
	}
	
	double weightProb(String word, String categoryName, WordProbability probability){
		double totalFeatureCount = 0.0;

		for (String existingCategory : getCategories()) {
			totalFeatureCount += getFeatureCount(word, existingCategory);
		}

		double nowProb = probability.prob(word, categoryName);

		double weightedProb = ((WEIGHT * AP) + (totalFeatureCount * nowProb)) / (WEIGHT + totalFeatureCount);

		return weightedProb;
	}
	
	double weightProb(String word, String categoryName){
		return weightProb(word, categoryName, DEFAULT_PROBABILITY);
	}
	
	@Override
	public void train(String doc, String category){
		Map<String, Integer> result = task.get(doc);

		for(String word : result.keySet()){
			incFeatureCount(word, category);
		}

		incCategoryCount(category);
	}

	abstract double prob(String word, String categoryName);

	abstract void setThresholds(String categoryName, double thres);

	abstract double getThresholds(String categoryName);
}
