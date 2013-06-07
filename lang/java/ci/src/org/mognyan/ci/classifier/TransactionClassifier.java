package org.mognyan.ci.classifier;

public interface TransactionClassifier extends Classifier{
	void start();
	void end(boolean fail);
}
