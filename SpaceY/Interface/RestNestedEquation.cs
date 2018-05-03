using System.Collections.Generic;

namespace SpaceY.Interface
{
    /// <summary>
    /// Main equation with flat list of referenced equations.
    /// </summary>
    public class RestNestedEquation
    {
        /// <summary>
        /// Gets or sets the main equation.
        /// </summary>
        public RestEquation Main { get; set; }

        /// <summary>
        /// Gets or sets a flat list of all referenced equations.
        /// </summary>
        public IList<RestEquation> References { get; set; }
    }
}
