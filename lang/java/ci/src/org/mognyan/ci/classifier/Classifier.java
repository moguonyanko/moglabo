package org.mognyan.ci.classifier;

public interface Classifier {
	String classify(String word) throws ClassifierException;
	void train(String doc, String category) throws ClassifierException;
	void setThresholds(String categoryName, double thres);
	double getThresholds(String categoryName);
	double prob(String word, String categoryName) throws ClassifierException;
}
