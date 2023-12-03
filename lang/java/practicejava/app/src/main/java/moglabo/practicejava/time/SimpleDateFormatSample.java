package moglabo.practicejava.time;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.Callable;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Executor;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.stream.Collectors;

public class SimpleDateFormatSample {

    private static final String SAMPLE_DATETIME_PATTERN = "yyyyMMddHHmmss";

    private static final SimpleDateFormat SIMPLE_DATE_FORMATTER =
            new SimpleDateFormat(SAMPLE_DATETIME_PATTERN);

    private static class FormatTask implements Callable<String> {

        private final Timestamp timestamp;

        public FormatTask(Timestamp timestamp) {
            this.timestamp = timestamp;
        }

        /**
         * @todo
         * SimpleDateFormat.format()時にSimpleDateFormatがスレッドセーフでないことに
         * 起因する例外が発生するはずだが発生しない。
         */
        @Override
        public String call() {
            var result = SIMPLE_DATE_FORMATTER.format(timestamp);
            return result;
        }

    }
    
    /**
     * @todo
     * 非同期処理を介してもSimpleDateFormatは例外をスローしない。
     */
    private static CompletableFuture<String> getAsyncFormatFuture(Timestamp timestamp, 
            Executor executor) {
        var future = CompletableFuture.supplyAsync(() -> {
            return new FormatTask(timestamp).call();
        }, executor);
        return future;
    }

    /**
     * 参考
     * https://mkyong.com/java/how-to-get-current-timestamps-in-java/
     */
    private static Timestamp getSampleTimestamp(int plusDay) {
        var instant = LocalDateTime.now().plusDays(plusDay).toInstant(ZoneOffset.UTC);
        var timestamp = Timestamp.from(instant);
        return timestamp;
    }

    private static List<String> invokeAllFormatting(int threadSize) throws InterruptedException {
        var executor = Executors.newVirtualThreadPerTaskExecutor();
        
        List<FormatTask> tasks = new ArrayList<>();
        for (var i = 0; i < threadSize; i++) {
            tasks.add(new FormatTask(getSampleTimestamp(i)));
        }
        var futures = executor.invokeAll(tasks);
        return futures.stream().map(f -> {
            try {
                return f.get();
            } catch (InterruptedException | ExecutionException ex) {
                throw new IllegalStateException(ex);
            }
        }).collect(Collectors.toList());
    }
    
    /**
     * 期待通りArrayIndexOutOfBoundsExceptionが発生することがある。
     */
    private static List<String> submitFormatting(int threadSize) throws InterruptedException {
        var executor = Executors.newVirtualThreadPerTaskExecutor();
        
        var futures = new ArrayList<Future<String>>();
        for (var i = 0; i < threadSize; i++) {
            futures.add(executor.submit(new FormatTask(getSampleTimestamp(i))));
        }
        
        return futures.stream().map(f -> {
            try {
                return f.get();
            } catch (InterruptedException | ExecutionException ex) {
                throw new IllegalStateException(ex);
            }
        }).collect(Collectors.toList());
    }
    
    /**
     * @todo
     * タスクの数が増えると他のメソッドのように例外は発生しないものの実行時間が非常に長くなる。
     */
    private static List<String> asyncFormatting(int size) throws InterruptedException, ExecutionException {
        var executor = Executors.newVirtualThreadPerTaskExecutor();
        var results = new ArrayList<String>();
        for (int i = 0; i < size; i++) {
            var future = getAsyncFormatFuture(getSampleTimestamp(i), executor);
            results.add(future.get());
        }
        // CompletableFuture::joinはCompletableFutureの結果を結合する。
        // 複数のCompletableFutureを連結するわけではない。
        // CompletableFuture.allOfはコレクションを受け取れない。
        //CompletableFuture.allOf(futures);
        return results;
    }

    public static void main(String[] args) throws InterruptedException, ExecutionException {
        var taskSize = 100000;
        //var result = submitFormatting(taskSize);
        //var result = invokeAllFormatting(taskSize);
        var result = asyncFormatting(taskSize);
        System.out.println(result);
    }

}
