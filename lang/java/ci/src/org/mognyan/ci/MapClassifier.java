package org.mognyan.ci;

import java.util.*;

import org.mognyan.ci.filter.WordFilterTask;

public abstract class MapClassifier implements Classifier {

	private final WordFilterTask task;
	private final Map<String, Map<String, Integer>> wordOverCategoryCount = new HashMap<>();
	private final Map<String, Integer> categoryCount = new HashMap<>();
	private final static double WEIGHT = 1.0;
	private final static double AP = 0.5;
	private final Map<String, Integer> thresholds = new HashMap<>();

	public MapClassifier(WordFilterTask task) {
		this.task = task;
	}

	private void incf(String word, String categoryName) {
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

	private void incc(String categoryName) {
		if (!categoryCount.containsKey(categoryName)) {
			categoryCount.put(categoryName, 0);
		}

		int nowCount = categoryCount.get(categoryName);
		categoryCount.put(categoryName, nowCount + 1);
	}

	abstract double prob(String word, String categoryName);

	abstract void setThresholds(String categoryName, double thres);

	abstract double getThresholds(String categoryName);
}
