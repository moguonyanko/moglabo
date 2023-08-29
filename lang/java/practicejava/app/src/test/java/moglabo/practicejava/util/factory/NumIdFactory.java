package moglabo.practicejava.util.factory;

import moglabo.practicejava.util.IdFactory;

public class NumIdFactory implements IdFactory<Integer> {

    @Override
    public Integer getId(String idType) {
        return switch (idType) {
            case "one" ->
                1;
            default ->
                0;
        };
    }

}
