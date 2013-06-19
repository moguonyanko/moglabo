package org.geese.ci.classifier;

public interface Classifier {
	String classify(String word) throws ClassifyException;
	void train(String doc, String category) throws TrainException;
	void setThresholds(String categoryName, double thres);
	double getThresholds(String categoryName);
	double prob(String word, String categoryName) throws ClassifyException;
}
