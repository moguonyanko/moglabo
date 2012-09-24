# My R library
# Reference:
# 	Rによるやさしい統計学
#		Takefumi Yamada, Taketoshi Sugisawa, Jyunichiro Murai
#

varp <- function(x){
	res <- mean((x-mean(x))^2)
	res
}

svar <- function(test){
	testm <- mean(test) #Median is avarage. 
	res <- sqrt(mean(test-testm)^2)
	res
}

avgsd <- function(test){
	div <- test-mean(test)
	absdiv <- abs(div)
	res <- mean(absdiv)
	res
}

rangedisp <- function(test){
	res <- max(test)-min(test)
	res
}

zpoint <- function(test){
	testm <- mean(test)
	testdiv <- test-testm
	testsd <- sqrt(mean((testdiv)^2))
	res <- testdiv/testsd
	res
}

devp <- function(test){
	res <- 10*zpoint(test)+50
	res
}

faicor <- function(test1, test2){
	crossp <- length(table(test1))==2&&length(table(test2))==2
	res <- ifelse(crossp, cor(test1, test2), NULL)
	res
}

dice <- function(face=6){
	lst <- list()
	element <- "shake"
	lst[[element]] <- function(num=1){
		res <- ceiling(runif(n=num, min=0, max=face))
		res
	}
	lst
}

expsamplemean <- function(testnum, sampsize, m, s){
	samps <- numeric(length=testnum)

	for(i in 1:testnum){
		samp <- rnorm(n=sampsize,mean=m,sd=s)
		samps[i] <- mean(samp)
	}

	samps
}

#Reported many warnings.
sampply <- function(testnum, sampsize, m, s, fun){
	samps <- numeric(length=testnum)

	for(i in 1:testnum){
		samp <- rnorm(n=sampsize,mean=m,sd=s)
		samps[i] <- mapply(fun, samp)
	}

	samps
}

varps <- function(testnum, samplesize, m, s){
	sampdist <- numeric(length=testnum)
	unbidist <- numeric(length=testnum)

	for(i in 1:testnum){
		samp <- rnorm(n=samplesize,mean=m,sd=s)
		sampdist[i] <- varp(samp)
		unbidist[i] <- var(samp)
	}

	lst <- list()
	lst[["sample"]] <- sampdist
	lst[["unbiase"]] <- unbidist

	lst
}

#If popvar is null, return t statistics value.
#Else return standard normal distribution value.
teststat <- function(data, popmean, popvar=var(data)){
	nume <- mean(data)-popmean
	deno <- sqrt(popvar/length(data))
	stat <- nume/deno
	stat
}

stdnormdist <- function(x, mmean, mvar){
	nume <- mean(x)-mmean
	deno <- sqrt(mvar/length(x))
	zstat <- nume/deno
	zstat
}

tdist <- function(data, mmean){
	nume <- mean(data)-mmean
	deno <- sqrt(var(data)/length(data))
	tstat <- nume/deno
	tstat
}

append <- function(dat, value){
	newdat <- c(dat)
	newdat[length(newdat)+1] <- value
	newdat
}

maketesttable <- function(data1, data2, term){
	len <- length(data1)
	d1 <- numeric(length=len)
	d2 <- numeric(length=len)
	o <- 1
	x <- 0
	for(i in 1:len){
		d1[i] <- ifelse(data1[i]==term,o,x)
		d2[i] <- ifelse(data2[i]==term,o,x)
	}
	tbl <- table(d1,d2)
	
	tbl
}

#Only practice sample.
makeguidedata <- function(){
	o <- 1	#like
	x <- 0	#bad
	mathdata <- c(x,x,o,o,x,x,x,x,x,o,o,x,o,x,x,o,x,x,x,x)
	statdata <- c(o,o,o,o,x,x,x,x,x,x,o,o,o,x,o,x,x,x,x,x)
	tbl <- table(mathdata,statdata)
	tbl
}

#Only practice sample.
makestudydata <- function(){
	st <- c(1,3,10,12,6,3,8,4,1,5)
	tp <- c(20,40,100,80,50,50,70,50,10,60)
	
	lst <- list()
	lst[["studytime"]] <- st
	lst[["testpoint"]] <- tp

	lst
}

#Only practice sample.
makestattestdata <- function(){
	before <- c(6,10,6,10,5,3,5,9,3,3,11,6,11,9,7,5,8,7,7,9)
	after <- c(10,13,8,15,8,6,9,10,7,3,18,14,18,11,12,5,7,12,7,7)
	
	lst <- list()
	lst[["before"]] <- before
	lst[["after"]] <- after

	lst
}

#Only practice sample.
makestatfavdata <- function(){
	o <- 1
	x <- 0
	
	favstat <- c(o,o,o,o,x,x,x,x,x,x,o,o,o,x,o,x,x,x,x,x)
	stattest <- c(6,10,6,10,5,3,5,9,3,3,11,6,11,9,7,5,8,7,7,9)
	len <- length(favstat)
	
	likeT <- numeric()
	badT <- numeric()

	for(i in 1:len){
		fav <- favstat[i]
		stat <- stattest[i]
		if(fav==o){
			likeT <- append(likeT, stat)
		}else{
			badT <- append(badT, stat)
		}
	}
	
	lst <- list()
	lst[["likeT"]] <- likeT
	lst[["badT"]] <- badT

	lst
}

#Only practice sample.
makefoodfavdata <- function(){
	j <- 1	#Japanese
	e <- 0	#Europian
	a <- 1 #Amatou
	k <- 0 #Karatou
	contfavdata <- c(e,j,j,e,j,e,e,j,e,e,j,e,j,e,j,j,e,e,j,j)
	tastfavdata <- c(a,k,a,a,k,k,k,k,a,a,a,a,k,k,a,k,k,a,k,k)
	tbl <- table(contfavdata,tastfavdata)
	tbl
}

pooledstddev <- function(dat1,dat2){
	mdat1 <- mean(dat1)
	mdat2 <- mean(dat2)
	vdat1 <- var(dat1)
	vdat2 <- var (dat2)
	lendat1 <- length(dat1)
	lendat2 <- length(dat2)

	pdev <- sqrt(((lendat1-1)*vdat1+(lendat2-1)*vdat2)/(lendat1+lendat2-2))

	pdev
}

stderrest <- function(dat1,dat2){
	pdev <- pooledstddev(dat1,dat2)
	sest <- pdev*sqrt(1/length(dat1)+1/length(dat2))

	sest
}

getrunif <- function(size,cutvec,lvvec){
	beforecate <- runif(n=size)
	aftercate <- cut(beforecate,cutvec)
	levels(aftercate) <- lvvec
	
	aftercate
}

rcor <- function(popcor,x,e){
	y <- popcor*x+sqrt(1-popcor^2)*e

	y
}

getrcor <- function(popcor,size){
	x <- runif(size)
	e <- runif(size)
	y <- rcor(popcor,x,e)

	return(list(x=x,y=y))
}

#TODO implement
getrcormultierror <- function(popcor,n,errorsize){
	x <- runif(n)
	ys <- list()

	for(i in 1:errorsize){
		e <- runif(n)
		y <- rcor(popcor,x,e)
		ys[[i]] <- y
	}

	ys
}

#First error probability
firsterrprob <- function(loopnum=10000){
	firsterrorcount <- 0
	for(i in 1:loopnum){
		gunA <- rnorm(n=10)
		gunB <- rnorm(n=10)
		gunC <- rnorm(n=10)
		resAB <- t.test(gunA,gunB,var.equal=TRUE)
		resBC <- t.test(gunB,gunC,var.equal=TRUE)
		resCA <- t.test(gunC,gunA,var.equal=TRUE)
		
		firsterrorcount <- firsterrorcount+ifelse(resAB$p.value<0.05 | resBC$p.value<0.05 | resCA$p.value<0.05,1,0)
	}

	firsterrorcount/loopnum
}
	
#Second error test
powertestbyttest <- function(size=10000){
	tps <- numeric(length=size)
	sigcount <- 0
	for(i in 1:size){
		g1 <- rnorm(n=10,mean=0,sd=1)
		g2 <- rnorm(n=10,mean=0.5,sd=1)
		result <- t.test(g1,g2,var.equal=TRUE)
		tps[i] <- result$statistic
		sigcount <- sigcount+ifelse(result$p.value<0.05,1,0)
	}

	return(list(power=sigcount/size,tpoints=tps))
}








