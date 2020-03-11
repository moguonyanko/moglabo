/**
 * クライアント側のmodule-info.java
 */

module mod.mylabo.worker {
    
    // サービス側でrequires transitive java.loggingと指定されていないと
    // クライアント側でrequiresする必要が出てくる。
    //requires java.logging;
    
    requires mod.mylabo.calculator;
    
}
