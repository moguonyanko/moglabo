package moglabo.practicejava.util.factory;

import moglabo.practicejava.util.IdFactory;

public class StrIdFactory implements IdFactory<String> {

    @Override
    public String getId(String idType) {
        return switch (idType) {
            case "one" ->
                "ONE";
            default ->
                "ZERO";
        };
    }
}
