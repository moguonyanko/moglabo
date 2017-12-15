module myclientmodule {
    requires myservicemodule;
    // usesを使う場合でもrequiresによる該当パッケージの指定は必須。
    uses myservicemodule.tools.Pen;
}
