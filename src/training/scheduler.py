"""Training schedulers and early stopping utilities."""


class EarlyStopping:
    """Early stopping to prevent overfitting.

    Monitors a validation metric and stops training when
    the metric stops improving.
    """

    def __init__(self, patience: int = 10, min_delta: float = 1e-4, mode: str = "min"):
        """
        Args:
            patience: Number of epochs to wait for improvement.
            min_delta: Minimum change to qualify as improvement.
            mode: 'min' for loss, 'max' for accuracy.
        """
        self.patience = patience
        self.min_delta = min_delta
        self.mode = mode
        self.best_value = float("inf") if mode == "min" else -float("inf")
        self.counter = 0
        self.early_stop = False

    def __call__(self, current_value: float) -> bool:
        """Check if training should stop.

        Args:
            current_value: Current validation metric value.

        Returns:
            True if training should stop.
        """
        if self.mode == "min":
            if current_value < self.best_value - self.min_delta:
                self.best_value = current_value
                self.counter = 0
            else:
                self.counter += 1
        else:  # mode == "max"
            if current_value > self.best_value + self.min_delta:
                self.best_value = current_value
                self.counter = 0
            else:
                self.counter += 1

        if self.counter >= self.patience:
            self.early_stop = True

        return self.early_stop
