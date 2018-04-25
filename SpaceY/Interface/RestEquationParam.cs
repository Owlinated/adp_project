namespace SpaceY.Interface
{
    /// <summary>
    /// Parameter of an equation
    /// </summary>
    public class RestEquationParam
    {
        /// <summary>
        /// Gets or sets the short name of a parameter.
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// Gets or sets the readable description of a parameter.
        /// </summary>
        public string Description { get; set; }

        /// <summary>
        /// Gets or sets the default value of a parameter.
        /// </summary>
        public decimal Default { get; set; }
    }
}
