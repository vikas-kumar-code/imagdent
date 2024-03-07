import React, { Component } from "react";
import { connect } from "react-redux";
import { Carousel, CarouselItem, CarouselControl, Spinner } from "reactstrap";

class Testimonial extends Component {
  constructor(props) {
    super(props);

    this.state = {
      items: [
        {
          html: (
            <div className="row">
              <div className="col-sm-12 text-right">
                <p className="review-text">
                  I Am very impressed with you all as well as being highly
                  proficient is absolutely adorable. I feel so relaxed in her
                  capable hands and hope to be her patient for a very long time!
                  You are a fantastic team and I feel very privileged to come to
                  you all!!!
                </p>
                <p>
                  <span className="review-author">- Wilmer Stevenson,</span>{" "}
                  <span className="review-author-position">
                    Creative manager
                  </span>
                </p>
              </div>
            </div>
          )
        },
        {
          html: (
            <div className="row">
              <div className="col-sm-12 text-right">
                <p className="review-text">
                  I Am very impressed with you all as well as being highly
                  proficient is absolutely adorable. I feel so relaxed in her
                  capable hands and hope to be her patient for a very long time!
                  You are a fantastic team and I feel very privileged to come to
                  you all!!!
                </p>
                <p>
                  <span className="review-author">- Wilmer Stevenson,</span>{" "}
                  <span className="review-author-position">
                    Creative manager
                  </span>
                </p>
              </div>
            </div>
          )
        },
        {
          html: (
            <div className="row">
              <div className="col-sm-12 text-right">
                <p className="review-text">
                  I Am very impressed with you all as well as being highly
                  proficient is absolutely adorable. I feel so relaxed in her
                  capable hands and hope to be her patient for a very long time!
                  You are a fantastic team and I feel very privileged to come to
                  you all!!!
                </p>
                <p>
                  <span className="review-author">- Wilmer Stevenson,</span>{" "}
                  <span className="review-author-position">
                    Creative manager
                  </span>
                </p>
              </div>
            </div>
          )
        }
      ],
      activeIndex: 0,
      animating: false,
      overLayLoader: true
    };
  }
  next = () => {
    if (this.state.animating) return;
    const nextIndex =
      this.state.activeIndex === this.state.items.length - 1
        ? 0
        : this.state.activeIndex + 1;
    this.setState({ activeIndex: nextIndex });
  };
  previous = () => {
    if (this.state.animating) return;
    const nextIndex =
      this.state.activeIndex === 0
        ? this.state.items.length - 1
        : this.state.activeIndex - 1;
    this.setState({ activeIndex: nextIndex });
  };
  setAnimating = animate => {
    this.setState({ animating: animate });
  };
  render() {
    return (
      <React.Fragment>
        <div className="w-100 carousel-inner" role="listbox">
          <div className="carousel-caption position-relative">
            <Carousel
              activeIndex={this.state.activeIndex}
              next={this.next}
              previous={this.previous}
              interval={false}
            >
              {this.state.items.map((item, index) => (
                <CarouselItem
                  onExiting={() => this.setAnimating(true)}
                  onExited={() => this.setAnimating(false)}
                  key={index}
                >
                  {item.html}
                </CarouselItem>
              ))}
              <div className="float-right">
                <CarouselControl
                  direction="prev"
                  directionText="Previous"
                  onClickHandler={this.previous}
                />

                <CarouselControl
                  direction="next"
                  directionText="Next"
                  onClickHandler={this.next}
                />
              </div>
            </Carousel>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    userType: state.userType
  };
};
export default connect(mapStateToProps)(Testimonial);
