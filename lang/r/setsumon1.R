zokusei <- read.csv("oubo_zokusei.csv", header=F)

summary(zokusei)
length(zokusei$V1)
nenrei <- na.omit(zokusei$V3) 
summary(nenrei)
boxplot(nenrei)

kiroku <- read.csv("oubo_kiroku.csv", header=F)

summary(kiroku)
length(kiroku$V1)
jikantai <- kiroku$V2
plot(jikantai)
library(chron)
day.of.week()



