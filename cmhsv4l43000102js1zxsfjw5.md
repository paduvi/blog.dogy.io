---
title: "Understanding Bloom Filter: Efficient Data Filtering Explained"
seoTitle: "Efficient Data Filtering with Bloom Filter"
seoDescription: "Bloom Filter use probabilistic methods for efficient data filtering and set membership, significant in many applications"
datePublished: Mon Nov 10 2025 08:10:44 GMT+0000 (Coordinated Universal Time)
cuid: cmhsv4l43000102js1zxsfjw5
slug: understanding-bloom-filter-efficient-data-filtering-explained
cover: https://cdn.hashnode.com/res/hashnode/image/upload/v1762754061138/bc9dc529-01bd-4fb2-9c1d-6c9cca2b9f70.webp
tags: algorithms, rocksdb, nosql, databases, data-structures, hbase, bloom-filter

---

A Bloom Filter is a probabilistic data structure used to test whether an element is a member of a set.

The reason it's called "probabilistic" is that the result it returns is not guaranteed to be 100% accurate; there is a certain margin of error.

## **The Problem: Set Membership**

> Given a set S of N elements, check if an element x is a member of S (x ∈ S).

This is a simple problem with multiple solutions:

* **The simplest way** is to iterate through every element in the set. This approach has a time complexity of O(N).
    
* **A better way** is to store set S in RAM using a Hash Table (also known as a HashMap or HashSet). This offers near-instant, constant-time lookups (Random Access).
    

But what if set S is extremely large? In such cases, the cost of iterating over S becomes expensive. Furthermore, if the data doesn't fit in memory and requires continuous disk access, the cost of checking membership can be significant.

## Why does the Bloom Filter shine?

This is where the Bloom Filter becomes popular, even though it might seem quite "dumb" at first glance. Its concept is somewhat similar to a Hash Table but is far more space-optimized. It quickly proves its usefulness by reducing queries to **expensive-to-access** resources like databases, disks, or network calls.

**Applications of Bloom Filter are vast, including:**

* **Databases:** Google BigTable, Apache HBase, Apache Cassandra, RocksDB, and PostgreSQL use them to reduce the cost of data lookups.
    
* **Web Browsing:** Google Chrome uses them to identify and warn users about malicious websites.
    
* **Content Platforms:** Medium uses them to avoid recommending articles a user has already read.
    
* **Security:** Mitigating DDoS attacks and checking for weak passwords or existing usernames/emails in a system.
    
* **Spell Checking:** Verifying if a word exists in a dictionary.
    

## **How does a Bloom Filter work?**

The core of a Bloom Filter is a bit array of M elements, all initially set to 0. Let's call this array **BF**.

![(Illustration with M=15)](https://dogy.io/wp-content/uploads/2020/10/image-1.png align="center")

### **Adding an Element**

When a new element is added to the set, it is passed through k different hash functions. Each hash function outputs a position within the bit array, and that bit is set to 1.

```python
def add(x):
    for i in range(k):
        position = hash_functions[i](x) % M
        BF[position] = 1
```

The hash functions should be independent and produce uniformly distributed outputs. They should also be fast and resource-efficient (which is why cryptographic hash functions like SHA are less commonly used). Examples of hash functions used are murmur, fnv, etc.

> **Note on Hash Functions:**
> 
> We typically use multiple (k) independent and fast hash functions (like murmur or fnv) to ensure a uniform distribution. Instead of finding k distinct algorithms, a technique called **Double Hashing** can be used. With just two independent hash functions, we can generate k hash values efficiently.

```python
def add(x):
    a = hash_function1(x)
    b = hash_function2(x)
    for i in range(k):
        position = (a + i * b) % M
        BF[position] = 1
```

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1762807013528/546a26d1-902f-4e51-82a6-7c9849df4ac1.png align="center")

### **Checking for an Element**

To check if a value x is in the set, we pass it through the same k hash functions and check the bits at the resulting positions.

```python
def check(x):
    a = hash_function1(x)
    b = hash_function2(x)
    for i in range(k):
        position = (a + i * b) % M
        if BF[position] == 0:
            return False
    return True # Means "possibly in S"
```

**Key Observations:**

* If **any** of the checked bits is 0, then x is **definitely not** in the set S.
    
* If **all** the checked bits are 1, then x is **probably** in S. However, there's a chance it's a **false positive** (the bits were set by other elements).
    
* The time complexity for both insertion and lookup is O(k), which is constant and independent of the set size N.
    

**Let's clarify the terminology:**

* **True Positive:** x is in S and the Bloom filter returns True.
    
* **False Positive:** x is *not* in S, but the Bloom filter returns True.
    
* **True Negative:** x is *not* in S and the Bloom filter returns False.
    
* **False Negative:** x is in S, but the Bloom filter returns False. *Note: Standard Bloom filter have* *zero false negatives.*
    

Despite its simplicity, the Bloom filter's false positive rate can be surprisingly low. The following chart illustrates how the rate decreases as the size of the bit array (M) and the number of hash functions (k) increase.

![Source: https://medium.com/@ngtung/bloom-filter-trong-golang-211d00443721](https://miro.medium.com/max/1600/1*sSuuWFeLpwVZIPuNSoAiyQ.png align="center")

---

## **The False Positive Probability**

The probability of a false positive for a Bloom filter is given by the formula:

$$P=\left (1-e^{-kN/M} \right )^{k}$$

You can plug in the expected number of elements (N) for your application and experiment with different values of M and k to estimate the false positive probability.

For those curious about the derivation, let's break it down. It's simpler than it looks!

Let's consider a Bloom filter with M=15 and k=3. We can conceptually divide the BF array into k segments (each of length \\(m=\frac{M}{k}=5\\)).

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1762758879021/f3f564c3-b5b2-428a-b18a-3bb4ec797d97.jpeg align="center")

Due to the properties of a good hash function, the probability that a specific bit in a segment is set to 1 after inserting one element is \\(\frac{1}{m}=\frac{1}{5}\\).

* Therefore, the probability that a specific bit is **not** set is \\(1-\frac{1}{m}\\).
    
* After inserting N elements, the probability that a specific bit is still 0 is:  
    \\(\left ( 1-\frac{1}{m} \right )^{N}\\)
    
* Therefore, according to the Taylor series approximation, the probability that a specific bit has been set to 1 is:  
    \\(\rho =1-\left ( 1-\frac{1}{m} \right )^{N}\approx1-e^{-N/m}\\)
    

For an element *not* in the set to yield a false positive, all k of its hash positions must be 1. The probability of this happening is:

$$P=\rho ^{k}$$

Based on \\(\rho \approx1-e^{-N/m}\\), we can work backward to find the threshold number of elements N at which the Bloom filter becomes saturated and the false positive rate rises too high. With M and P fixed, the optimal N is approximately:

$$N \approx -\frac{M}{k}\ln \left ( 1-\rho \right ) \approx M\frac{\ln \rho \ln \left ( 1-\rho \right )}{-\ln P} \leqslant M\frac{\left (\ln 2 \right )^{2}}{\left |ln P \right |}$$

\\(N_{max}\\) is achieved when \\(\rho =\frac 1{2}\\). Substituting into \\(P=\rho ^{k}\\), we find the optimal number of hash functions is:

$$k=\log_{2}\left ( \frac{1}{P} \right )$$

## **Practical Example: The Power of 32kB**

Let's allocate about 32kB of memory (M = 262,144 bits) and see the results for different false positive probabilities (P). The numbers are impressive for such a small memory footprint!

| P | 0.1% | 0.01% | 0.001% | 0.0001% |
| --- | --- | --- | --- | --- |
| **k** | 10 | 14 | 17 | 20 |
| \\(N_{max}\\) | 18,232 | 13,674 | 10,939 | 9,116 |

## **Important Considerations**

* **Deletion:** Traditional Bloom Filter do not support deletion. However, variants like the **Counting Bloom Filter** and **Cuckoo Filter** have been developed to solve this problem.
    
* **Data Storage:** A Bloom Filter does not store the actual elements. It only tests for membership. Therefore, a separate, definitive data store is still required to retrieve the elements themselves (which is why it's called a "filter").
    
* **Scaling:** What happens when the set S grows beyond the warning threshold N? One method is to allocate a new Bloom Filter with a stricter false positive rate (e.g., \\(P_{i+1}=r\times P_{i}\\) for \\(0< r\leq 1\\)). New elements are inserted into this new filter. When checking for membership, you check all filters sequentially. If an element is not found in any filter, it is definitely not in S.
    

<details data-node-type="hn-details-summary"><summary>Author's Note:</summary><div data-type="detailsContent"><em>This English article is an adapted and expanded version of my </em><a target="_self" rel="noopener noreferrer nofollow" href="https://dogy.io/2020/10/06/bloom-filter/" style="pointer-events: none"><em>original blog post</em></a><em>, which was first written in Vietnamese. I have translated, refined, and structured the content for a wider audience.</em></div></details>