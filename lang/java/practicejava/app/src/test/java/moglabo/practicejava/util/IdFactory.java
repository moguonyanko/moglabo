package moglabo.practicejava.util;

public interface IdFactory<T> {

    T getId(String idType);

}
