import { StepBack, StepForward } from "lucide-react";
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { updateProfile } from '../../utils/update profile';
import useClosePopupOutside from '../../utils/close outside click';
import "./avatar.css";

export default function AvatarSelection({ setShowAvatarSelection }) {
	const [images, setImages] = useState([]);
	const [currDisplayAvtIdx, setCurrDisplayAvtIdx] = useState(0);
	const avatarRef = useRef();
	useClosePopupOutside(avatarRef, setShowAvatarSelection, false);

	useEffect(() => {
		const fetchImages = async () => {
			try {
				const response = await axios.get('http://localhost:3000/api/uploaded-images');
				console.log("response:", response.data);
				setImages(response.data);
			} catch (error) {
				console.error('Error fetching images:', error);
			}
		};

		fetchImages();

	}, []);

	function nextAvt() {
		if (currDisplayAvtIdx == images.length - 1) {
			setCurrDisplayAvtIdx(0);
		} else {
			setCurrDisplayAvtIdx(i => i + 1);
		}
	}

	function prevAvt() {
		if (currDisplayAvtIdx == 0) {
			setCurrDisplayAvtIdx(images.length - 1);
		} else {
			setCurrDisplayAvtIdx(i => i - 1);
		}
	}

	function setAvatarURL() {
		const avatarURL = images[currDisplayAvtIdx].key;
		console.log('avatarURL:', avatarURL);
		updateProfile({ pfp: avatarURL });
	}

	if (images.length === 0) {
		return <div name="avatar images comming from BE"></div>;
	}

	return (
		<>
			{/* <div className="avatar-bg" onClick={() => handleAvatarSeletionDisplay()}></div> */}
			<div className="avatar-selection-container">
				<div ref={avatarRef} className="avatar-selection-box">
					<button className="show-avatars-btn show-avatars-btn-left" onClick={prevAvt} >
						<StepBack />
					</button>
					<div className="image-gallery avatar-img-container">
						{images.map((image, index) => (
							<img
								key={image.id}
								src={`https://utfs.io/f/${image.key}`}
								alt={image.name.split('.')[0]}
								className={`actual-avatar-img ${index === currDisplayAvtIdx ? 'selected' : ''}`}
							/>
						))}
						{/* <img
							key={images[currDisplayAvtIdx].id}
							src={`https://utfs.io/f/${images[currDisplayAvtIdx].key}`}
							alt="Uploaded"
							className="actual-avatar-img signup-avater"
						/> */}
					</div>
					<button className="show-avatars-btn show-avatars-btn-right" onClick={nextAvt}>
						<StepForward />
					</button>
					<div className="avatar-selection-btn-container" onClick={setAvatarURL}>
						<button className="avatar-selection-btn">Select Avatar</button>
					</div>
				</div>
			</div>
		</>
	);
}