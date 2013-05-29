package org.mognyan.ci.util;

import org.mognyan.ci.Classifier;

public class TrainUtil {

	public static void sampleTrain(Classifier cl) {
		cl.train("Nobady owns the water.", "good");
		cl.train("the quick rabbit jumps fences.", "good");
		cl.train("buy pharmaceuticals now", "bad");
		cl.train("make quick money at the online casino", "bad");
		cl.train("the quick brown fox jumps", "good");
	}
}
