package org.mognyan.test.ci;

import org.junit.runner.RunWith;
import org.junit.runners.Suite;

@RunWith(Suite.class)
@Suite.SuiteClasses({
	TestConfigLoading.class,
	TestDocumentFiltering.class,
})
public class AllCITests{
}