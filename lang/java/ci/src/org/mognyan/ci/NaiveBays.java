package org.mognyan.ci;

import java.util.*;

import org.mognyan.ci.filter.WordFilterTask;

public class NaiveBays extends AbstractClassifier {

	private static final double DEFAULT_THRESHOLDS = 1.0;
	
	public NaiveBays(WordFilterTask task) {
		super(task);
	}

	private double docProb(String doc, String categoryName) {
		Map<String, Integer> result = task.get(doc);

		double prob = 1.0;

		for (String word : result.keySet()) {
			prob *= weightProb(word, categoryName);
		}

		return prob;
	}

	@Override
	public double prob(String word, String categoryName) {
		double cc = getCategoryCount(categoryName);
		double total = getTotalCategoryCount();
		double categoryp = cc / total;
		double docp = docProb(word, categoryName);

		return categoryp * docp;
	}
	
	@Override
	public void setThresholds(String categoryName, double thres) {
		thresholds.put(categoryName, thres);
	}

	@Override
	public double getThresholds(String categoryName) {
		if (!thresholds.containsKey(categoryName)) {
			return DEFAULT_THRESHOLDS;
		} else {
			return thresholds.get(categoryName);
		}
	}	

	@Override
	public String classify(String word) {
		Map<String, Double> probs = new HashMap<>();

		double max = 0.0;
		String best = defaultClass;

		for (String category : getCategories()) {
			probs.put(category, prob(word, category));
			if (probs.get(category) > max) {
				max = probs.get(category);
				best = category;
			}
		}

		for (String category : probs.keySet()) {
			if (!category.equals(best)
				&& probs.get(category) * getThresholds(best) > probs.get(best)) {
				return defaultClass;
			}
		}

		return best;
	}
}
