package test.exercise.concurrent;

import java.util.*;
import java.util.concurrent.*;
import java.util.concurrent.StructuredTaskScope.*;
import java.util.stream.*;

import org.junit.Test;
import static org.junit.Assert.*;

/**
 * ### 参考
 *
 * https://www.baeldung.com/java-structured-concurrency
 * https://docs.oracle.com/en/java/javase/21/core/structured-concurrency.html#GUID-97F95BF4-A1E2-40A3-8439-6BB4E3D5C422
 */
public class TestStructuredConcurrency {

    private static class TooSlowException extends Exception {

        public TooSlowException(String s) {
            super(s);
        }
    }

    private static class SCRandomTasks {

        public int randomTask(int maxDuration, int threshold)
                throws InterruptedException, TooSlowException {
            var t = new Random().nextInt(maxDuration);

            System.out.println("Duration: " + t);
            if (t > threshold) {
                throw new TooSlowException("Duration " + t
                        + " greater than threshold " + threshold);
            }

            Thread.sleep(t);

            return t;
        }

        private int getResult(List<Subtask<Integer>> subtasks) {
            var totalDuration = subtasks.stream()
                    .map(t -> t.get())
                    .reduce(0, Integer::sum);

            return totalDuration;
        }

        void handleShutdownOnFailure() throws ExecutionException, InterruptedException {
            try (var scope = StructuredTaskScope.open()) {
                // var t = new SCRandomTasks();
                var subtasks = IntStream.range(0, 5)
                        .mapToObj(i -> scope.fork(() -> randomTask(1000, 850)))
                        .toList();

                if (scope.isCancelled()) {
                    throw new InterruptedException("タスクはキャンセルされました。");
                }

                scope.join();

                var totalDuration = getResult(subtasks);

                System.out.println("handleShutdownOnFailure task to finish: " + totalDuration);
            }
        }

        void handleShutdownOnSuccess() throws ExecutionException, InterruptedException {
            try (var scope = StructuredTaskScope.open()) {
                var subtasks = IntStream.range(0, 5)
                        .mapToObj(i -> scope.fork(() -> randomTask(1000, 850)))
                        .toList();
                scope.join();

                var totalDuration = getResult(subtasks);

                System.out.println("handleShutdownOnSuccess task to finish: " + totalDuration);
            }
        }

    }

    @Test
    public void 構造化された並列処理を実行できる() {
        var myApp = new SCRandomTasks();
        try {
            System.out.println("Running handleShutdownOnFailure...");
            myApp.handleShutdownOnFailure();
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
        try {
            System.out.println("Running handleShutdownOnSuccess...");
            myApp.handleShutdownOnSuccess();
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }

}
