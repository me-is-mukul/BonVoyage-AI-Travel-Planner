# DayNightCNN — Architecture & Maths

Binary classifier: **Day (1) / Night (0)** on 128×128 RGB images.

---

## Architecture

```
Input  (128, 128, 3)
        │
┌───────▼────────────────────────────────┐
│  Conv2D 32 × (3×3)  + BN + ReLU       │  → (128,128,32)
│  MaxPool (2×2)  + Dropout 0.1         │  → ( 64, 64,32)
├────────────────────────────────────────┤
│  Conv2D 64 × (3×3)  + BN + ReLU       │  → ( 64, 64,64)
│  MaxPool (2×2)  + Dropout 0.1         │  → ( 32, 32,64)
├────────────────────────────────────────┤
│  Conv2D 128 × (3×3) + BN + ReLU       │  → ( 32, 32,128)
│  MaxPool (2×2)  + Dropout 0.2         │  → ( 16, 16,128)
├────────────────────────────────────────┤
│  Conv2D 256 × (3×3) + BN + ReLU       │  → ( 16, 16,256)
│  GlobalAveragePooling2D               │  → (256,)
├────────────────────────────────────────┤
│  Dense 256  + BN + ReLU + Dropout 0.5 │  → (256,)
│  Dense 1    + Sigmoid                 │  → (1,)   ∈ [0,1]
└────────────────────────────────────────┘
```

Total trainable parameters: ~1.3 M

---

## Maths

### Convolution

Each filter $W \in \mathbb{R}^{k \times k \times C_{in}}$ slides over the input and computes a dot product at every position:

$$
(X * W)_{i,j} = \sum_{m=0}^{k-1}\sum_{n=0}^{k-1}\sum_{c=0}^{C_{in}-1} X_{i+m,\, j+n,\, c} \cdot W_{m,n,c} + b
$$

`padding='same'` zero-pads the input so spatial size is preserved.  
Output channels = number of filters (32 → 64 → 128 → 256).

---

### Batch Normalisation

Applied after every Conv and Dense layer, before activation.  
For a mini-batch $\mathcal{B} = \{x_1 \ldots x_m\}$:

$$
\mu_\mathcal{B} = \frac{1}{m}\sum x_i \qquad
\sigma^2_\mathcal{B} = \frac{1}{m}\sum (x_i - \mu_\mathcal{B})^2
$$

$$
\hat{x}_i = \frac{x_i - \mu_\mathcal{B}}{\sqrt{\sigma^2_\mathcal{B} + \varepsilon}}
\qquad
y_i = \gamma\,\hat{x}_i + \beta
$$

$\gamma, \beta$ are learned per-channel. Keeps activations well-scaled throughout depth, enabling higher learning rates.

---

### ReLU

$$
\text{ReLU}(x) = \max(0,\, x)
$$

Cheap, non-saturating. Avoids vanishing gradients compared to sigmoid/tanh in hidden layers.

---

### MaxPooling (2×2)

$$
y_{i,j} = \max_{(m,n)\in 2\times 2} x_{2i+m,\,2j+n}
$$

Halves spatial dimensions, discards less-active values, gives translational invariance.

---

### Global Average Pooling

Replaces Flatten. For a feature map $F \in \mathbb{R}^{H \times W \times C}$:

$$
\text{GAP}_c = \frac{1}{H \cdot W}\sum_{i,j} F_{i,j,c}
$$

Collapses the spatial axes into a single vector of length $C$, dramatically reducing parameters and overfitting risk.

---

### Dropout

During training, each neuron is zeroed with probability $p$ and the survivors are scaled by $\frac{1}{1-p}$ to keep expected values constant:

$$
\tilde{h}_i = \frac{r_i \cdot h_i}{1-p}, \qquad r_i \sim \text{Bernoulli}(1-p)
$$

At inference $r_i = 1$ always. Acts as ensemble regularisation.

---

### Output & Loss

**Sigmoid** squashes the final logit to a probability:

$$
\hat{y} = \sigma(z) = \frac{1}{1+e^{-z}} \in (0,1)
$$

**Binary cross-entropy** loss over $N$ samples:

$$
\mathcal{L} = -\frac{1}{N}\sum_{i=1}^{N}\bigl[y_i \log\hat{y}_i + (1-y_i)\log(1-\hat{y}_i)\bigr]
$$

Prediction rule: $\hat{y} \geq 0.5 \Rightarrow$ Day, $\hat{y} < 0.5 \Rightarrow$ Night.

---

## Training details

| Setting | Value |
|---------|-------|
| Optimiser | Adam (lr = 1e-3) |
| LR schedule | ReduceLROnPlateau ÷2 after 5 stale val epochs |
| Early stopping | patience 10 on val accuracy |
| Class imbalance | `class_weight='balanced'` (522 day / 227 night) |
| Augmentation | rotation ±10°, shift 10%, h-flip, zoom 10% |
| Image size | 128 × 128 × 3, normalised to [0, 1] |
