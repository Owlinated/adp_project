namespace SpaceY.Interface
{
    /// <summary>
    /// Result of an equations evaluation
    /// </summary>
    public class RestEvaluationResult
    {
        /// <summary>
        /// Gets or sets a value indicating whether the evaluation was successful.
        /// </summary>
        public bool Success { get; set; }

        /// <summary>
        /// Gets or sets the value to which the equation was evaluated.
        /// </summary>
        public decimal? Value { get; set; }
    }
}
