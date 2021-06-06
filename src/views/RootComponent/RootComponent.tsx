import * as React from "react";
import "./RootComponent.css";

import getAllImages from "../../images";
import ItemComponent from "../ItemComponent";

export interface RootComponentProps {}

export interface RootComponentState {
  containerWidth: number;
  currentPage: number;
  totalPages: number;

  isDragging: boolean;
  firstTouchLocation: number;
  lastTouchLocation: number;
  dragOffset: number;
}

class RootComponent extends React.Component<
  RootComponentProps,
  RootComponentState
> {
  state = {
    containerWidth: 0,
    currentPage: 0,
    totalPages: 0,
    // dragging
    isDragging: false,
    dragOffset: 0,
    firstTouchLocation: 0,
    lastTouchLocation: 0,
  };
  containerRef: React.RefObject<HTMLDivElement> = React.createRef();

  updateContainerWidth = () => {
    const containerWidth =
      this.containerRef.current?.getBoundingClientRect().width || 0;
    this.setState({ containerWidth });
  };

  componentDidMount = () => {
    this.updateContainerWidth();
    this.setState({ totalPages: getAllImages().length });
    window.onresize = this.updateContainerWidth;
  };

  normalizePage = (page: number) => {
    const { totalPages } = this.state;
    let newPage = page;
    newPage = newPage >= totalPages ? 0 : newPage;
    newPage = newPage < 0 ? totalPages - 1 : newPage;
    return newPage;
  };

  handleCarouselMovement = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    const { currentPage } = this.state;
    const operation = e.currentTarget.name;
    let newPage = operation === "right" ? currentPage + 1 : currentPage - 1;
    newPage = this.normalizePage(newPage);
    this.setState({ currentPage: newPage });
  };

  handleDragStart = (clientX: number) => {
    console.log(`drag start first touch ->> ${clientX}`);
    this.setState({ isDragging: true, firstTouchLocation: clientX });
  };

  handleDragEnd = () => {
    const {
      firstTouchLocation,
      lastTouchLocation,
      containerWidth,
      currentPage,
    } = this.state;
    const amountMoved = lastTouchLocation - firstTouchLocation;

    let newPage = currentPage;
    if (Math.abs(amountMoved) >= containerWidth / 2) {
      newPage = amountMoved > 0 ? currentPage - 1 : currentPage + 1;
      newPage = this.normalizePage(newPage);
    }

    this.setState({
      isDragging: false,
      firstTouchLocation: 0,
      dragOffset: 0,
      currentPage: newPage,
    });
  };

  handleDragMove = (clientX: number) => {
    const { isDragging, firstTouchLocation } = this.state;
    if (!isDragging) return;

    const amountMoved = clientX - firstTouchLocation;
    this.setState({ dragOffset: amountMoved, lastTouchLocation: clientX });
  };

  handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    this.handleDragStart(e.clientX);
  };

  handleMouseUp = () => {
    this.handleDragEnd();
  };

  handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    this.handleDragMove(e.clientX);
  };

  handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    this.handleDragStart(e.targetTouches[0].clientX);
  };

  handleTouchEnd = () => {
    this.handleDragEnd();
  };

  handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    this.handleDragMove(e.targetTouches[0].clientX);
  };

  getOffsetForIndex = (idx: number) => {
    const { isDragging, currentPage, dragOffset, containerWidth } = this.state;
    if (!isDragging) return -(containerWidth * (currentPage - idx));

    return -(containerWidth * (currentPage - idx)) + dragOffset;
  };

  renderCarousel = () => {
    const { isDragging } = this.state;
    return (
      <div
        className="carousel-container"
        ref={this.containerRef}
        onMouseDown={this.handleMouseDown}
        onMouseUp={this.handleMouseUp}
        onMouseMove={this.handleMouseMove}
        onTouchStart={this.handleTouchStart}
        onTouchEnd={this.handleTouchEnd}
        onTouchMove={this.handleTouchMove}
      >
        {getAllImages().map((x, idx) => (
          <ItemComponent
            offset={this.getOffsetForIndex(idx)}
            key={idx}
            imagePath={x}
            shouldAnimate={!isDragging}
          />
        ))}
      </div>
    );
  };

  renderButtons = () => (
    <React.Fragment>
      <button
        className="carousel-button-left"
        name="left"
        onClick={this.handleCarouselMovement}
      >
        Left
      </button>
      <button
        className="carousel-button-right"
        name="right"
        onClick={this.handleCarouselMovement}
      >
        Right
      </button>
    </React.Fragment>
  );

  render = () => {
    const { containerWidth, currentPage, isDragging, dragOffset } = this.state;

    console.log(dragOffset);
    return (
      <div className="container">
        {this.renderCarousel()} {this.renderButtons()}
      </div>
    );
  };
}

export default RootComponent;
