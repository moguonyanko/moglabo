package org.mognyan.ci;

public interface Classifier {
	String Classify(String word, String defaultClass);
	void train(String doc, String category);
}
