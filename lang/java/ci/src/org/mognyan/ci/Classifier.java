package org.mognyan.ci;

public interface Classifier {
	String classify(String word);
	void train(String doc, String category);
	void setThresholds(String categoryName, double thres);
	double getThresholds(String categoryName);
	double prob(String word, String categoryName);
}
