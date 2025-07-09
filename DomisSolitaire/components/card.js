import React, { Component } from 'react';
import {
    View,
    Animated,
    Dimensions,
    Image,
    PanResponder,
    StyleSheet
} from 'react-native';

import { cardSize, imageMap } from './helpers';
const { width, height } = Dimensions.get('window');

const scale = 3; // use const

export default class Card extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pan: new Animated.ValueXY(),
            draggable: props.draggable,
            dragging: false,
            source: props.source,
            id: props.source,
            faceDown: props.faceDown,
            mounted: false,
        };

        // Animated value trackers
        this._animatedValueX = 0;
        this._animatedValueY = 0;

        // PanResponder setup
        this._panResponder = PanResponder.create({
            onMoveShouldSetResponderCapture: () => true,
            onMoveShouldSetPanResponderCapture: () => this.state.draggable,
            onPanResponderGrant: (e, gestureState) => {
                this.setState({ dragging: true });
                this.state.pan.setOffset({ x: this._animatedValueX, y: this._animatedValueY });
                this.state.pan.setValue({ x: 0, y: 0 });
            },
            onPanResponderMove: Animated.event(
                [null, { dx: this.state.pan.x, dy: this.state.pan.y }],
                { useNativeDriver: false }
            ),
            onPanResponderRelease: (event, gesture) => {
                const e = event.nativeEvent;
                if (this.props.releasedOn && this.props.releasedOn(e.pageX, e.pageY, this.state.id)) {
                    if (this.props.deleted) {
                        this.props.deleted(this.state.id);
                    }
                    this.setState({ mounted: true });
                } else {
                    Animated.spring(this.state.pan, {
                        toValue: 0,
                        useNativeDriver: false
                    }).start();
                }
                this.setState({ dragging: false });
            }
        });
    }

    componentDidMount() {
        // Listen to animated values
        this.state.pan.x.addListener((value) => {
            this._animatedValueX = value.value;
        });
        this.state.pan.y.addListener((value) => {
            this._animatedValueY = value.value;
        });
    }

    componentWillUnmount() {
        this.state.pan.x.removeAllListeners();
        this.state.pan.y.removeAllListeners();
    }

    getStyle() {
        return [
            styles.card,
            {
                transform: [
                    { translateX: this.state.pan.x },
                    { translateY: this.state.pan.y },
                ]
            }
        ];
    }

    render() {
        const { faceDown, dragging, source, mounted } = this.state;
        const zIndex = dragging ? 10 : 0;
        if (mounted) {
            return null;
        }

        if (faceDown) {
            return (
                <View style={[styles.card, { zIndex }]}>
                    <Image source={require('../img/back.jpg')} style={styles.img} />
                </View>
            );
        }

        return (
            <Animated.View
                style={[this.getStyle(), { zIndex }]}
                {...this._panResponder.panHandlers}
            >
                <Image source={imageMap[source]} style={styles.img} />
            </Animated.View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    card: {
        width: cardSize(width).width,
        height: cardSize(width).height,
        borderWidth: 1,
        borderRadius: 5,
    },
    img: {
        flex: 1,
        height: null,
        width: null,
        borderRadius: 5,
    }
});
