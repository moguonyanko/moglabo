package org.mognyan.ci;

public interface Classifier {
	String classify(String word, String defaultClass);
	void train(String doc, String category);
}
